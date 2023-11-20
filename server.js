import bodyParser from "body-parser";
// import { configDotenv } from "dotenv";
import { createInvitation } from "./wizarr.js";
import express from "express";
import fs from "fs";
import { sendEmail } from "./email.js";

// Import the file system module

// Create express app
const app = express();

// Configure express to use body-parser as middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure dotenv to use .env file
// configDotenv({ path: ".env" });

app.post("/sellix-webhook", async (req, res) => {
    // Debug logging for request body
    if (process.env.DEBUG) {
        console.log("Request Body:", req.body);
        console.log("Email:", req.body.data.customer_email);
    }

    // Check if webhook event is subscription:created
    if (req.body.event != "subscription:created") {
        res.status(200).send("OK");
        return;
    }

    // Create new invitation as needed
    const newInvitation = {
        expires: null,
        unlimited: false,
        specific_libraries: [
            "f137a2dd21bbc1b99aa5c0f6bf02a805",
            "a656b907eb3a73532e40e44b968d0225",
            "6f6fb1dc3511eaff3818fe8833f9efae",
            "9d7ad6afe9afa2dab1a2f6e00ad28fa6",
            "8a1edb3ba513c553155420f4190a9b43"
        ]
    };

    try {
        // Create new invitation in Wizarr
        const code = await createInvitation(newInvitation);
        const email = req.body.data.customer_email;

        // Send email to customer
        await sendEmail(email, code);

        // Write email and code to a text file
        fs.appendFileSync("email_and_codes.txt", `Email: ${email}, Code: ${code}\n`);

    } catch (error) {
        // Failed to create invitation
        res.status(500).send("Internal Server Error");
        console.error("Error creating invitation:", error);
        return;
    }

    // Send response of OK
    res.status(200).send("OK");
});

const PORT = 6925;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});