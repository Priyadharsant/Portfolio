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

async function sendTelegramMessage(text, replyMarkup = null) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_API_BASE } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[API] Skipped Telegram notification. Missing Telegram Env variables.');
    return;
  }

  const apiBase = TELEGRAM_API_BASE || 'https://api.telegram.org';

  try {
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    };

    if (!replyMarkup) {
      payload.reply_markup = {
        inline_keyboard: [
          [{ text: "🌐 Open Portfolio", url: "https://priyan.online" }]
        ]
      };
    } else {
      payload.reply_markup = replyMarkup;
    }

    const response = await fetch(`${apiBase}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.description || 'Telegram API returned an error');
    }

    console.log(`[API] Telegram message sent to chat ${TELEGRAM_CHAT_ID}`);
  } catch (err) {
    console.error('[API] Failed to send Telegram message:', err);
  }
}

async function sendInstantReport(chatId = null) {
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

    const dateStr = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const statusText = errors.length > 0
      ? `🚨 <b>System Warning:</b> <code>${errors.length}</code> crash(es) were logged today. Please check the logs!`
      : `🛡️ <b>System Healthy:</b> Your portfolio ran perfectly today with <code>0</code> client-side crashes.`;

    const reportMsg = `📊 <b>DAILY SYSTEM DIGEST</b>
<i>Portfolio Application</i>

<b>Date:</b> <code>${dateStr}</code>
<b>Status:</b> ${statusText}

<b>Traffic Overview</b>
• <b>Unique Visitors:</b> <code>${uniqueIPs}</code>
• <b>Page Loads:</b> <code>${visits.length}</code>

<b>System Health</b>
• <b>Crashes Logged:</b> <code>${errors.length}</code>

<blockquote expandable><b>Performance Note</b>
The system processed <b>${visits.length}</b> requests today. ${errors.length === 0 ? "Everything is running smoothly without issues." : "Please review the recent error alerts to ensure stability."}</blockquote>`;

    if (chatId) {
      const { TELEGRAM_BOT_TOKEN, TELEGRAM_API_BASE } = process.env;
      if (!TELEGRAM_BOT_TOKEN) return;
      const apiBase = TELEGRAM_API_BASE || 'https://api.telegram.org';
      await fetch(`${apiBase}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reportMsg, parse_mode: 'HTML' })
      });
    } else {
      await sendTelegramMessage(reportMsg);
    }
  } catch (e) {
    console.error("Failed to generate report", e);
  }
}

async function sendRecentErrors(chatId) {
  try {
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_API_BASE } = process.env;
    if (!TELEGRAM_BOT_TOKEN) return;
    const apiBase = TELEGRAM_API_BASE || 'https://api.telegram.org';

    const recentErrors = await Activity.find({ type: 'ERROR' }).sort({ createdAt: -1 }).limit(3);

    let msg = `🐞 <b>RECENT ERRORS</b>\n<i>Portfolio Application</i>\n\n`;
    if (recentErrors.length === 0) {
      msg += `✅ No errors found in the logs!`;
    } else {
      recentErrors.forEach((err, idx) => {
        const safeContext = escapeHtml(err.context || 'Unknown');
        const safeError = escapeHtml(err.errorDetails?.substring(0, 200) || 'Unknown');
        msg += `<b>${idx + 1}.</b> <code>${safeContext}</code>\n<blockquote expandable><pre><code class="language-javascript">${safeError}</code></pre></blockquote>\n`;
      });
    }

    await fetch(`${apiBase}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
    });
  } catch (e) {
    console.error("Failed to send errors", e);
  }
}

app.post("/api/telegram/webhook", async (req, res) => {
  try {
    const update = req.body;

    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      if (chatId && cb.data === 'cmd_report') await sendInstantReport(chatId);
      if (chatId && cb.data === 'cmd_errors') await sendRecentErrors(chatId);

      const { TELEGRAM_BOT_TOKEN, TELEGRAM_API_BASE } = process.env;
      if (TELEGRAM_BOT_TOKEN) {
        const apiBase = TELEGRAM_API_BASE || 'https://api.telegram.org';
        await fetch(`${apiBase}/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: cb.id })
        });
      }
    }

    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;
      if (text === 'report' || text === 'status') await sendInstantReport(chatId);
      if (text === 'errors') await sendRecentErrors(chatId);
    }
  } catch (err) {
    console.error('[API] Webhook error:', err);
  }
  res.sendStatus(200);
});

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
    const ua = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

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

    // Send immediate Telegram alert
    const safeContext = escapeHtml(context);
    const safeError = escapeHtml(error?.substring(0, 700) || 'Unknown error');
    const safeIp = escapeHtml(ip);
    const safeUa = escapeHtml(ua);
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    const telegramMsg = `🔴 <b>CRITICAL SYSTEM ALERT</b>
<i>Portfolio Application</i>

<b>Context</b>
<code>${safeContext}</code>

<b>Client Details</b>
• <b>IP:</b> <code>${safeIp}</code>
• <b>Device:</b> <code>${safeUa}</code>

<b>Time</b>
<code>${timestamp} IST</code>

<blockquote expandable><b>Stack Trace</b>
<pre><code class="language-javascript">${safeError}</code></pre></blockquote>`;

    await sendTelegramMessage(telegramMsg);

    return res.json({ success: true });
  } catch (err) {
    console.error('[API] Notify error endpoint failed:', err);
    return res.status(500).json({ success: false });
  }
});

// Setup Daily 9:00 PM CRON Job
cron.schedule('0 21 13 * * *', async () => {
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

    // Send Telegram digest
    await sendInstantReport();

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
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const contactMsg = `📨 <b>NEW CONTACT MESSAGE</b>
<i>Portfolio Application</i>

<b>• Name:</b> <code>${safeName}</code>
<b>• Email:</b> <code>${safeEmail}</code>

<b>Message:</b>
<blockquote expandable>${safeMessage}</blockquote>`;

    await sendTelegramMessage(contactMsg);

    return res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Failed to send contact email:', error);

    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});
async function setupTelegramMenu() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_API_BASE } = process.env;
  if (!TELEGRAM_BOT_TOKEN) return;
  const apiBase = TELEGRAM_API_BASE || 'https://api.telegram.org';

  try {
    const commands = [
      { command: 'report', description: 'Get instant daily report' },
      { command: 'status', description: 'Check system health' },
      { command: 'errors', description: 'View recent crash logs' }
    ];

    await fetch(`${apiBase}/bot${TELEGRAM_BOT_TOKEN}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    });
    console.log('[API] Telegram bot menu commands updated.');

    if (process.env.TELEGRAM_WEBHOOK_URL) {
      await fetch(`${apiBase}/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: process.env.TELEGRAM_WEBHOOK_URL })
      });
      console.log(`[API] Telegram webhook set to ${process.env.TELEGRAM_WEBHOOK_URL}`);
    } else {
      console.log('[API] Telegram webhook setup skipped. TELEGRAM_WEBHOOK_URL is not set.');
    }
  } catch (err) {
    console.error('[API] Failed to set Telegram menu commands:', err);
  }
}

app.listen(port, () => {
  console.log(`Mail server running on http://localhost:${port}`);
  console.log(
    `Mail config: provider=resend, apiKey=${process.env.RESEND_API_KEY ? 'set' : 'missing'}, from=${process.env.RESEND_FROM || 'missing'}, to=${process.env.MAIL_TO ? 'set' : 'missing'}, autoReply=${process.env.RESEND_SEND_AUTO_REPLY === 'true' ? 'enabled' : 'disabled'}`,
  );
  setupTelegramMenu();
});
