import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

export default logger;



/**
 
    curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int001","data":{"to":"puri69132@gmail.com","subject":"Interview Followup 1","html":"<p>Hey! This is test 1 email.</p>","senderName":"StartWith Live","senderEmail":"interview@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int002","data":{"to":"puri69132@gmail.com","subject":"Support Mail 2","html":"<p>This is test 2 from support.</p>","senderName":"Support Team","senderEmail":"support@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int003","data":{"to":"puri69132@gmail.com","subject":"Contact Us 3","html":"<p>This is test 3 contact email.</p>","senderName":"Contact Desk","senderEmail":"contact@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int004","data":{"to":"puri69132@gmail.com","subject":"Help Center 4","html":"<p>Testing email number 4.</p>","senderName":"Help Center","senderEmail":"help@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int005","data":{"to":"puri69132@gmail.com","subject":"Hi Mail 5","html":"<p>This is email 5 from Hi sender.</p>","senderName":"Hi Bot","senderEmail":"hi@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int006","data":{"to":"puri69132@gmail.com","subject":"Info Update 6","html":"<p>Email 6 testing queue.</p>","senderName":"Info","senderEmail":"interview@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int007","data":{"to":"puri69132@gmail.com","subject":"Team Update 7","html":"<p>This is queued email 7.</p>","senderName":"Team","senderEmail":"support@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int008","data":{"to":"puri69132@gmail.com","subject":"Notice 8","html":"<p>Email number 8 queued successfully.</p>","senderName":"Notice Board","senderEmail":"contact@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int009","data":{"to":"puri69132@gmail.com","subject":"Reminder 9","html":"<p>This is reminder 9 email test.</p>","senderName":"Reminder Bot","senderEmail":"help@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int010","data":{"to":"puri69132@gmail.com","subject":"Final Test 10","html":"<p>This is the last test email number 10.</p>","senderName":"Automation","senderEmail":"hi@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int011","data":{"to":"puri69132@gmail.com","subject":"Interview Followup 11","html":"<p>Hey! This is test 1 email.</p>","senderName":"StartWith Live","senderEmail":"interview@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int012","data":{"to":"puri69132@gmail.com","subject":"Support Mail 12","html":"<p>This is test 2 from support.</p>","senderName":"Support Team","senderEmail":"support@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int013","data":{"to":"puri69132@gmail.com","subject":"Contact Us 13","html":"<p>This is test 3 contact email.</p>","senderName":"Contact Desk","senderEmail":"contact@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int014","data":{"to":"puri69132@gmail.com","subject":"Help Center 14","html":"<p>Testing email number 4.</p>","senderName":"Help Center","senderEmail":"help@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int015","data":{"to":"puri69132@gmail.com","subject":"Hi Mail 15","html":"<p>This is email 5 from Hi sender.</p>","senderName":"Hi Bot","senderEmail":"hi@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int016","data":{"to":"puri69132@gmail.com","subject":"Info Update 16","html":"<p>Email 6 testing queue.</p>","senderName":"Info","senderEmail":"interview@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int017","data":{"to":"puri69132@gmail.com","subject":"Team Update 17","html":"<p>This is queued email 7.</p>","senderName":"Team","senderEmail":"support@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int018","data":{"to":"puri69132@gmail.com","subject":"Notice 18","html":"<p>Email number 8 queued successfully.</p>","senderName":"Notice Board","senderEmail":"contact@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int019","data":{"to":"puri69132@gmail.com","subject":"Reminder 19","html":"<p>This is reminder 9 email test.</p>","senderName":"Reminder Bot","senderEmail":"help@startwith.live"}}' && curl -X POST http://localhost:3121/send/interview \
    -H "Content-Type: application/json" \
    -d '{"ownerId":"user1","roomId":"roomA","interviewId":"int020","data":{"to":"puri69132@gmail.com","subject":"Final Test 20","html":"<p>This is the last test email number 10.</p>","senderName":"Automation","senderEmail":"hi@startwith.live"}}'

 */