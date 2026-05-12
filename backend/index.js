import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Using a flexible schema, assuming the collection is 'portfolios' or 'portfolio' 
// Let's use 'portfolios' by default, or just 'portfolio'
const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }), 'Portfolio');

app.use(cors());
app.use(express.json());

const requiredEnv = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'MAIL_TO'];

function getMissingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

function getMailConfig() {
  const port = Number(process.env.MAIL_PORT);

  return {
    host: process.env.MAIL_HOST,
    port,
    secure: process.env.MAIL_SECURE === 'true' || port === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildOwnerMail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  return {
    subject: `New portfolio message from ${name}`,
    text: `New portfolio message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f172a;padding:24px;">
            <p style="margin:0;color:#2dd4bf;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Portfolio Contact</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">New message received</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px;color:#374151;">Someone submitted your portfolio contact form.</p>
            <div style="margin-bottom:18px;padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin:0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#0f766e;">${safeEmail}</a></p>
            </div>
            <div style="padding:16px;background:#ecfeff;border-left:4px solid #14b8a6;border-radius:8px;">
              <p style="margin:0 0 8px;font-weight:700;color:#0f172a;">Message</p>
              <p style="margin:0;line-height:1.7;color:#334155;">${safeMessage}</p>
            </div>
          </div>
        </div>
      </div>
    `,
  };
}

function buildAutoReplyMail({ name, message }) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  return {
    subject: 'Thanks for contacting Priyadharsan T',
    text: `Hi ${name},\n\nThanks for reaching out through my portfolio. I received your message and will get back to you soon.\n\nYour message:\n${message}\n\nRegards,\nPriyadharsan T`,
    html: `
      <div style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f172a;padding:26px;">
            <p style="margin:0;color:#2dd4bf;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Priyadharsan T</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">Thanks for your message</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 14px;line-height:1.7;color:#334155;">Hi ${safeName},</p>
            <p style="margin:0 0 16px;line-height:1.7;color:#334155;">
              Thanks for reaching out through my portfolio. I have received your message and will get back to you soon.
            </p>
            <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
              <p style="margin:0 0 8px;font-weight:700;color:#0f172a;">Your message</p>
              <p style="margin:0;line-height:1.7;color:#475569;">${safeMessage}</p>
            </div>
            <p style="margin:22px 0 0;line-height:1.7;color:#334155;">
              Regards,<br />
              <strong>Priyadharsan T</strong><br />
              Backend Developer • Frontend Developer • Problem Solver
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/portfolio', async (_req, res) => {
  try {
    const data = await Portfolio.findOne();
    if (!data) {
      return res.status(404).json({ message: 'Portfolio data not found' });
    }
    return res.json(data);
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill all contact form fields.' });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return res.status(500).json({
      message: `Mail server is missing: ${missingEnv.join(', ')}`,
    });
  }

  const transporter = nodemailer.createTransport(getMailConfig());

  try {
    const ownerMail = buildOwnerMail({ name, email, message });
    const autoReplyMail = buildAutoReplyMail({ name, message });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: ownerMail.subject,
      text: ownerMail.text,
      html: ownerMail.html,
    });

    await transporter.sendMail({
      from: `"Priyadharsan T" <${process.env.MAIL_USER}>`,
      to: email,
      subject: autoReplyMail.subject,
      text: autoReplyMail.text,
      html: autoReplyMail.html,
    });

    return res.json({ message: 'Message sent successfully. Auto-reply sent to your email.' });
  } catch (error) {
    console.error('Failed to send contact email:', error);

    if (error?.code === 'EAUTH') {
      return res.status(401).json({
        message:
          'Mail login failed. Use a Gmail app password in MAIL_PASS, not your normal Gmail password.',
      });
    }

    if (error?.code === 'ETIMEDOUT' || error?.code === 'ESOCKET') {
      console.error(
        `Mail connection failed. Check MAIL_HOST, MAIL_PORT, and MAIL_SECURE. Current config: host=${process.env.MAIL_HOST || 'missing'}, port=${process.env.MAIL_PORT || 'missing'}, secure=${process.env.MAIL_SECURE || 'auto'}`,
      );

      return res.status(504).json({
        message: 'Unable to send your message right now. Please try again later.',
      });
    }

    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Mail server running on http://localhost:${port}`);
  console.log(
    `Mail config: host=${process.env.MAIL_HOST || 'missing'}, port=${process.env.MAIL_PORT || 'missing'}, secure=${process.env.MAIL_SECURE || 'auto'}, user=${process.env.MAIL_USER ? 'set' : 'missing'}, to=${process.env.MAIL_TO ? 'set' : 'missing'}`,
  );
});
