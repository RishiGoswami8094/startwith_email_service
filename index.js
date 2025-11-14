import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import SibApiV3Sdk from "sib-api-v3-sdk";
import logger from "./logger.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Create a single Redis connection and queue here so server and worker
// run in the same process/file.
const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});
const emailQueue = new Queue("emails", { connection });
const failedQueue = new Queue("failedEmails", { connection });

app.post("/send/interview", async (req, res) => {
    try {
        const { ownerId, roomId, interviewId, data } = req.body;
        if (!ownerId || !roomId || !interviewId || !data) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        await emailQueue.add(
            "sendEmail",
            { ownerId, roomId, interviewId, data },
            {
                attempts: 3,
                backoff: { type: "fixed", delay: 2000 },
                removeOnComplete: true,
                removeOnFail: false
            });
        res.status(202).json({ queued: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => { logger.info(`Email queue API running on port ${process.env.PORT}`) });

app.get("/", (req, res) => {
    res.send("hello  emailservice startwith :)");
});

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const worker = new Worker(
    "emails",
    async (job) => {
        const { ownerId, roomId, interviewId, data } = job.data;
        const { to, subject, html, senderName, senderEmail } = data;

        try {
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            sendSmtpEmail.sender = {
                name: senderName || "StartWith Live",
                email: senderEmail || "interview@startwith.live"
            };
            sendSmtpEmail.to = [{ email: to }];
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = html;

            await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);

            // Report success back to backend
            console.log("backend url: ", `${process.env.BACKEND_URL}/email/status`)
            await fetch(`${process.env.BACKEND_URL}/email/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerId,
                    roomId,
                    interviewId,
                    data: { emailStatus: "SUCCESS", message: "Email sent successfully" }
                })
            });
            logger.info(`[SUCCESS] Email sent to ${to}`);
        } catch (err) {
            console.log("[ERROR] ",err)
            logger.error(`[ERROR] Failed to send to ${to}: ${err.message}`);

            // Queue to failedEmails for retry or later processing
            await failedQueue.add("failedEmail", {
                ownerId,
                roomId,
                interviewId,
                data: { emailStatus: "FAILED", message: err.message }
            });
        }
    },
    {
        connection,
        concurrency: 2,  // Process up to 2 jobs concurrently
        limiter: { max: 2, duration: 1000 }  // Max 2 jobs per second
    }
);

// Worker error handler
worker.on("failed", (job, err) => {
    console.log("FAILED: ", job)
    console.log("FAILED ERROR: ", err)
    logger.error(`[RETRY FAILED] Job ${job.id} (${job.name}) after ${job.attemptsMade} attempts: ${err.message}`);
});

// Failed worker - Handle DLQ jobs
const failedWorker = new Worker(
    "failedEmails",
    async (job) => {
        const { ownerId, roomId, interviewId, data } = job.data;

        // Notify backend that a job permanently failed
        await fetch(`${process.env.BACKEND_URL}/email/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ownerId,
                roomId,
                interviewId,
                data
            })
        });
    },
    { connection }
);

// Failed worker event handler
failedWorker.on("completed", (job) => {
    console.log("failed for: ", job)
    logger.info(`[DLQ] Reported failed email for owner ${job.data.ownerId}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    logger.info("Shutting down...");
    await emailQueue.close();
    await failedQueue.close();
    await worker.close();
    await failedWorker.close();
    await connection.quit();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    logger.info("Shutting down...");
    await emailQueue.close();
    await failedQueue.close();
    await worker.close();
    await failedWorker.close();
    await connection.quit();
    process.exit(0);
});
