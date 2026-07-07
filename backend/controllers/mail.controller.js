import nodemailer from "nodemailer";

const requiredMailEnvVars = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_FROM",
    "CONTACT_RECEIVER_EMAIL",
];

let transporter;

const getMissingMailConfig = () => requiredMailEnvVars.filter((key) => !process.env[key]);

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    return transporter;
};

const escapeHtml = (value) =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

const normalizeHeaderValue = (value) => String(value).trim().replace(/[\r\n]+/g, " ");

export const sendFeedback = async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
    }

    const missingConfig = getMissingMailConfig();
    if (missingConfig.length > 0) {
        console.error("Missing mail configuration:", missingConfig.join(", "));
        return res.status(500).json({ success: false, message: "Mail service is not configured." });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const headerSafeName = normalizeHeaderValue(name);
    const headerSafeEmail = normalizeHeaderValue(email);

    const mail = {
        to: process.env.CONTACT_RECEIVER_EMAIL.split(",").map((address) => address.trim()).filter(Boolean),
        from: process.env.MAIL_FROM,
        replyTo: headerSafeEmail,
        subject: `PaperHunt Feedback from ${headerSafeName}`,
        text: `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
        html: `
      <h3>New Feedback Received</h3>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
    };

    try {
        await getTransporter().sendMail(mail);
        res.status(200).json({ success: true, message: "Feedback sent successfully!" });
    } catch (error) {
        console.error("Mail Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to send feedback." });
    }
};