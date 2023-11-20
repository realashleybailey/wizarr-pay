import { createTransport } from "nodemailer";
import { readFileSync } from 'fs';

/**
 * Transporter for sending emails
 */
const getTransport = () => createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "True",
    ignoreTLS: process.env.EMAIL_IGNORE_TLS === "True",
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD
    }
});

/**
 * Parse the email template and replace the placeholders
 * 
 * @param {string} code 
 * @returns {string} html
 */
const emailTemplate = (code) => {
    const template = readFileSync(process.env.EMAIL_TEMPLATE, 'utf8');
    const server_url = process.env.WIZARR_URL;

    let html = template;

    html = html.replaceAll('[SERVER_URL]', server_url)
    html = html.replaceAll('[INVITE_CODE]', code);

    return html;
}

/**
 * Censor password for logging
 * @param {string} password
 * @returns {string} censored password
 */
const censorPassword = (password) => {
    const length = password.length;
    return password.substring(0, length / 3) + "*".repeat(length / 2);
}

/**
 * Send an email to the user with the code for there invitation
 * 
 * @param {string} email 
 * @param {string} code 
 */
const sendEmail = async (email, code) => {
    // Debug logging for email
    if (process.env.DEBUG) console.table({
        "EMAIL_HOST:": process.env.EMAIL_HOST + ":" + process.env.EMAIL_PORT,
        "EMAIL_HOST_USER:": process.env.EMAIL_HOST_USER,
        "EMAIL_HOST_PASSWORD:": censorPassword(process.env.EMAIL_HOST_PASSWORD)
    })

    // Debug logging for email
    if (process.env.DEBUG) console.table({
        "EMAIL_FROM:": process.env.EMAIL_FROM,
        "EMAIL_TO:": email,
        "EMAIL_SUBJECT:": process.env.EMAIL_SUBJECT,
        "EMAIL_TEMPLATE:": process.env.EMAIL_TEMPLATE
    })

    // Create transporter
    const transporter = getTransport();

    // Send email to customer
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: process.env.EMAIL_SUBJECT,
        html: emailTemplate(code)
    });

    // Debug logging for email
    if (process.env.DEBUG) console.log("Message sent:", info.messageId);
};

export { sendEmail, emailTemplate };