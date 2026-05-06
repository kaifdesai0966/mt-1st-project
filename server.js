const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password"
  }
});

// Email endpoint
app.post('/send-email', (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const mailOptions = {
        from: "Medicine Reminder",
        to: to,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            // Even if it fails (due to dummy credentials), we return 200 for the frontend demo
            // or we could return 500. Let's return a specific format so the frontend can handle it.
            return res.status(500).json({ success: false, error: error.message });
        }
        console.log("Email sent:", info.response);
        res.json({ success: true, message: "Email sent successfully" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Email Service running on http://localhost:${PORT}`);
});
