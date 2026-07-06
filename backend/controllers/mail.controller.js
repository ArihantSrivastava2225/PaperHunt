import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendFeedback = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
    }

    const msg = {
        to: ['arihantsrivastava_cs24a02_013@dtu.ac.in'],
        from: process.env.VERIFIED_SENDER_EMAIL, // Must be verified in SendGrid
        subject: `PaperHunt Feedback from ${name}`,
        text: `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
        html: `
      <h3>New Feedback Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ success: true, message: "Feedback sent successfully!" });
    } catch (error) {
        console.error("SendGrid Error:", error.response?.body || error.message);
        res.status(500).json({ success: false, message: "Failed to send feedback." });
    }
};
