import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Using a flexible schema, assuming the collection is 'portfolios' or 'portfolio' 
// Let's use 'portfolios' by default, or just 'portfolio'
const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }), 'Portfolio');

const Activity = mongoose.model('Activity', new mongoose.Schema({
  type: String, // 'VISIT' or 'ERROR'
  ip: String,
  ua: String,
  context: String,
  errorDetails: String,
  createdAt: { type: Date, default: Date.now }
}), 'ActivityLogs');

app.use(cors());
app.use(express.json());

const requiredEnv = ['RESEND_API_KEY', 'RESEND_FROM', 'MAIL_TO'];

function getMissingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function sendResendEmail(payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || 'Resend failed to send email.');
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

async function sendWhatsAppMessage(text) {
  const { META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, WHATSAPP_TO } = process.env;
  if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID || !WHATSAPP_TO) {
    console.log('[API] Skipped WhatsApp notification. Missing Meta/WhatsApp Env variables.');
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${META_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: WHATSAPP_TO,
        type: 'text',
        text: {
          preview_url: false,
          body: text
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Meta API returned an error');
    }

    console.log(`[API] WhatsApp message sent via Meta to ${WHATSAPP_TO}`);
  } catch (err) {
    console.error('[API] Failed to send WhatsApp message via Meta:', err);
  }
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

app.get('/api/resume', async (req, res) => {
  try {
    const data = await Portfolio.findOne();
    if (!data || !data.profile || !data.profile.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const response = await fetch(data.profile.resume);
    if (!response.ok) {
      throw new Error('Failed to fetch resume file');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    } else {
      res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    }

    return res.send(buffer);
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/notify/visit', async (req, res) => {
  try {
    const ua = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    // Save to DB for daily digest
    await Activity.create({ type: 'VISIT', ip, ua });
    console.log(`[API] Saved VISIT to DB from IP: ${ip}`);

    return res.json({ success: true });
  } catch (err) {
    console.error('[API] Notify visit error:', err);
    return res.status(500).json({ success: false });
  }
});

app.post('/api/notify/error', async (req, res) => {
  try {
    const { error, context } = req.body || {};

    // Save to DB for daily digest
    await Activity.create({ type: 'ERROR', context, errorDetails: error });
    console.log(`[API] Saved ERROR to DB: ${context}`);

    // Send immediate alert
    if (process.env.REPORT_MAIL && process.env.MAIL_TO && process.env.RESEND_API_KEY) {
      await sendResendEmail({
        from: process.env.REPORT_MAIL,
        to: process.env.MAIL_TO,
        subject: 'Portfolio Error Alert',
        html: `
          <div style="margin:0;padding:24px;background:#fef2f2;font-family:Arial,sans-serif;color:#111827;">
            <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #fecaca;border-radius:12px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(239, 68, 68, 0.1);">
              <div style="background:#dc2626;padding:24px;">
                <p style="margin:0;color:#fca5a5;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Critical Alert</p>
                <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">Portfolio Crash Report</h1>
              </div>
              <div style="padding:24px;">
                <p style="margin:0 0 16px;color:#374151;">An unexpected JavaScript error occurred on your portfolio site.</p>
                <div style="margin-bottom:18px;padding:16px;background:#fef2f2;border-radius:10px;border:1px solid #fecaca;">
                  <p style="margin:0 0 8px;color:#7f1d1d;font-weight:700;">Context / Location:</p>
                  <p style="margin:0;color:#991b1b;font-family:monospace;">${escapeHtml(context)}</p>
                </div>
                <div style="padding:16px;background:#1e293b;border-radius:8px;overflow-x:auto;">
                  <p style="margin:0 0 8px;font-weight:700;color:#cbd5e1;">Stack Trace</p>
                  <pre style="margin:0;color:#f8fafc;font-family:monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(error)}</pre>
                </div>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`[API] Sent immediate error alert email to ${process.env.REPORT_MAIL}`);
    } else {
      console.log(`[API] Skipped immediate error alert email. Missing Env variables (REPORT_MAIL: ${!!process.env.REPORT_MAIL}, RESEND_FROM: ${!!process.env.RESEND_FROM}, RESEND_API_KEY: ${!!process.env.RESEND_API_KEY})`);
    }

    // Send immediate WhatsApp alert
    await sendWhatsAppMessage(`🚨 *Portfolio Crash Alert*\n\n*Context:* ${context}\n*Error:* ${error?.substring(0, 500) || 'Unknown error'}`);

    return res.json({ success: true });
  } catch (err) {
    console.error('[API] Notify error endpoint failed:', err);
    return res.status(500).json({ success: false });
  }
});
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});
// Setup Daily 9:00 PM CRON Job
cron.schedule('0 0 21 * * *', async () => {
  console.log('Running daily 9:00 PM report cron...');
  if (!process.env.REPORT_MAIL || !process.env.RESEND_FROM || !process.env.RESEND_API_KEY) {
    console.log('Missing env for report mail, skipping cron.');
    return;
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const visits = activities.filter(a => a.type === 'VISIT');
    const errors = activities.filter(a => a.type === 'ERROR');
    const uniqueIPs = new Set(visits.map(v => v.ip)).size;

    const html = `
      <div style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.05);">
          <div style="background:#0f172a;padding:24px;">
            <p style="margin:0;color:#2dd4bf;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Daily Analytics</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">Portfolio Digest</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 20px;color:#475569;">Here is the activity summary for today (${new Date().toLocaleDateString()}).</p>
            
            <div style="margin-bottom:16px;padding:20px;background:#f0fdfa;border-radius:10px;border:1px solid #ccfbf1;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0d9488;text-transform:uppercase;">Unique Visitors</p>
                <p style="margin:0;font-size:32px;font-weight:900;color:#0f766e;">${uniqueIPs}</p>
              </div>
              <div style="text-align:right;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0d9488;text-transform:uppercase;">Total Page Loads</p>
                <p style="margin:0;font-size:32px;font-weight:900;color:#0f766e;">${visits.length}</p>
              </div>
            </div>

            <div style="padding:20px;background:${errors.length > 0 ? '#fef2f2' : '#f8fafc'};border-radius:10px;border:1px solid ${errors.length > 0 ? '#fecaca' : '#e2e8f0'};">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${errors.length > 0 ? '#dc2626' : '#64748b'};text-transform:uppercase;">Stability Report</p>
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:14px;font-weight:700;background:${errors.length > 0 ? '#dc2626' : '#10b981'};color:#fff;">
                  ${errors.length} Errors
                </span>
              </div>
              <p style="margin:0;color:${errors.length > 0 ? '#991b1b' : '#475569'};font-size:14px;line-height:1.6;">
                ${errors.length > 0 ? 'Your site encountered crashes today. Please review the real-time email alerts for detailed stack traces to fix these issues.' : 'Excellent! Your site ran perfectly today with zero client-side crashes or errors.'}
              </p>
            </div>
            
            <div style="margin-top:24px;text-align:center;">
              <a href="#" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;">Review Portfolio</a>
            </div>
          </div>
        </div>
      </div>
    `;

    await sendResendEmail({
      from: process.env.REPORT_MAIL,
      to: process.env.MAIL_TO,
      subject: `Daily Portfolio Digest (${visits.length} visits, ${errors.length} errors)`,
      html,
    });

    console.log('Daily report sent successfully.');

    // Send WhatsApp digest
    await sendWhatsAppMessage(`📊 *Daily Portfolio Report*\n\n*Date:* ${new Date().toLocaleDateString()}\n*Unique Visitors:* ${uniqueIPs}\n*Total Page Loads:* ${visits.length}\n*Errors:* ${errors.length}\n\n${errors.length > 0 ? '⚠️ Your site encountered crashes today.' : '✅ Your site ran perfectly today!'}`);

    // Cleanup logs older than 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await Activity.deleteMany({ createdAt: { $lt: oneWeekAgo } });

  } catch (err) {
    console.error('Failed to run daily report cron:', err);
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};
  console.log("Mail triggered")
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill all contact form fields.' });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return res.status(500).json({
      message: `Mail server is missing: ${missingEnv.join(', ')}`,
    });
  }

  try {
    const ownerMail = buildOwnerMail({ name, email, message });

    await sendResendEmail({
      from: process.env.RESEND_FROM,
      to: process.env.MAIL_TO,
      reply_to: email,
      subject: ownerMail.subject,
      text: ownerMail.text,
      html: ownerMail.html,
    });

    console.log(`Contact owner email sent via Resend: from=${email}, to=${process.env.MAIL_TO}`);

    if (process.env.RESEND_SEND_AUTO_REPLY === 'true') {
      const autoReplyMail = buildAutoReplyMail({ name, message });

      await sendResendEmail({
        from: process.env.RESEND_FROM,
        to: email,
        subject: autoReplyMail.subject,
        text: autoReplyMail.text,
        html: autoReplyMail.html,
      });

      console.log(`Contact auto-reply sent via Resend: to=${email}`);
    } else {
      console.log(`Contact auto-reply skipped: RESEND_SEND_AUTO_REPLY is not true, to=${email}`);
    }

    return res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Failed to send contact email:', error);

    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Mail server running on http://localhost:${port}`);
  console.log(
    `Mail config: provider=resend, apiKey=${process.env.RESEND_API_KEY ? 'set' : 'missing'}, from=${process.env.RESEND_FROM || 'missing'}, to=${process.env.MAIL_TO ? 'set' : 'missing'}, autoReply=${process.env.RESEND_SEND_AUTO_REPLY === 'true' ? 'enabled' : 'disabled'}`,
  );
});
