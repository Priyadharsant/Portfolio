import type { Handler } from '@netlify/functions';
import portfolioData from '../../backend/portfolio-data.json';

// In-memory rate limiting per IP (resets on container recreation)
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 12; // 12 queries per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  entry.count += 1;
  return false;
}

// Built-in Deterministic Fuzzy/Keyword Matcher (Offline Fallback 2)
function getOfflineFallbackAnswer(userQuery: string): string {
  const q = userQuery.toLowerCase();

  if (q.includes('skill') || q.includes('stack') || q.includes('technolog') || q.includes('frontend') || q.includes('backend') || q.includes('language')) {
    const categories = portfolioData.skills.map(s => `**${s.title}**: ${s.items.join(', ')}`).join('\n\n');
    return `Here are Priyadharsan's core technical skills:\n\n${categories}\n\n*He specializes in building scalable full-stack applications with React, TypeScript, Node.js, and modern cloud architectures.*`;
  }

  if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('built')) {
    const projectList = portfolioData.projects.map(p => `• **${p.title}** (${p.status || 'Active'}): ${p.description}\n  *Stack: ${p.stack?.join(', ') || 'Full-Stack'}*`).join('\n\n');
    return `Here are Priyadharsan's featured projects:\n\n${projectList}\n\nYou can click on any project in the portfolio to view live demos and source code!`;
  }

  if (q.includes('experience') || q.includes('job') || q.includes('intern') || q.includes('company') || q.includes('role')) {
    const exp = portfolioData.experience;
    return `**${exp.title}** at **${exp.organization}** (${exp.badge}):\n\n${exp.points.map(p => `• ${p}`).join('\n')}`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire') || q.includes('linkedin') || q.includes('github')) {
    const p = portfolioData.profile;
    return `You can reach out to Priyadharsan directly through:\n\n• **Email**: [${p.email}](mailto:${p.email})\n• **LinkedIn**: [Profile](${p.linkedin})\n• **GitHub**: [github.com/${p.github}](${p.github})\n\nYou can also submit a message straight through the Contact section below!`;
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
    return `You can view or download Priyadharsan's official resume right from the **Resume** section on this site, or directly via [View Resume](/resume).`;
  }

  if (q.includes('who') || q.includes('about') || q.includes('priyadharsan') || q.includes('summary')) {
    return `**${portfolioData.profile.name}** is a ${portfolioData.profile.title} based in India.\n\n${portfolioData.about.paragraphs.join('\n\n')}\n\n**Currently exploring**: ${portfolioData.about.currentlyWorkingOn.join(', ')}.`;
  }

  return `Priyadharsan is a ${portfolioData.profile.title} with expertise in modern full-stack engineering (React, Node.js, Express, MongoDB, TypeScript). Feel free to ask about his **skills**, **featured projects**, **experience**, or **how to contact him**!`;
}

// System Instruction to ground the AI strictly in Priyadharsan's portfolio
const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Priyadharsan's personal portfolio website.
Your objective is to help recruiters, fellow developers, and visitors learn about Priyadharsan's skills, background, projects, and accomplishments in an engaging, professional, and friendly manner.

Here is Priyadharsan's verified portfolio information:
Name: ${portfolioData.profile.name}
Title: ${portfolioData.profile.title}
Tagline: ${portfolioData.profile.tagline}
Email: ${portfolioData.profile.email}
LinkedIn: ${portfolioData.profile.linkedin}
GitHub: ${portfolioData.profile.github}
LeetCode: ${portfolioData.profile.leetcode || 'Active'}
CodeChef: ${portfolioData.profile.codechef || 'Active'}

About:
${portfolioData.about.paragraphs.join(' ')}
Currently Working On: ${portfolioData.about.currentlyWorkingOn.join(', ')}

Skills:
${portfolioData.skills.map(s => `- ${s.title}: ${s.items.join(', ')}`).join('\n')}

Experience:
- Title: ${portfolioData.experience.title} at ${portfolioData.experience.organization} (${portfolioData.experience.badge})
Points:
${portfolioData.experience.points.map(p => `  * ${p}`).join('\n')}

Projects:
${portfolioData.projects.map(p => `- Title: ${p.title} (${p.status || 'Active'})
  Description: ${p.description}
  Stack: ${p.stack?.join(', ') || 'N/A'}
  GitHub: ${p.github || 'Available'}
  Preview: ${p.demo || 'Available'}`).join('\n\n')}

Achievements:
${portfolioData.achievements?.map(a => `- ${a.title}: ${a.description}`).join('\n') || 'Various competitive programming and hackathon milestones'}

Guidelines:
1. Always be polite, concise, and professional.
2. Ground all answers solely in Priyadharsan's verified background above.
3. For project live links, never use "Demo link" or "Demo live" — always refer to them as "Preview" or "[Preview](url)".
4. Format all links as clickable Markdown: [Preview](url), [LinkedIn](url), [GitHub](url), [Email](mailto:email).
5. At the very end of your response, ALWAYS suggest 2 to 3 concise, clickable follow-up questions tailored to your answer. Format them exactly like this:
Quick Questions:
• [first question]
• [second question]
• [third question]`;

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Too many queries. Please wait a moment.' }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body || '{}');
    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message is required.' }),
      };
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    let reply = '';
    let source = 'gemini';

    // 1. Primary AI Provider: Google Gemini
    if (geminiApiKey) {
      const geminiModels = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
      for (const model of geminiModels) {
        try {
          const contents = [];
          // Add sanitized conversation history if present
          if (Array.isArray(history)) {
            for (const h of history.slice(-4)) {
              if (h.role && h.text) {
                contents.push({
                  role: h.role === 'user' ? 'user' : 'model',
                  parts: [{ text: String(h.text) }]
                });
              }
            }
          }
          const promptWithInstructions = `${message}

(Note: Please answer accurately and briefly. After your answer, on a new line write "Quick Questions:" followed by 2 or 3 short follow-up questions starting with "• " that the visitor might ask next.)`;
          contents.push({ role: 'user', parts: [{ text: promptWithInstructions }] });

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                contents,
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 1500,
                }
              })
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              reply = text.trim();
              source = `gemini (${model})`;
              break;
            }
          }
        } catch (geminiErr) {
          console.warn(`[AI Chat] Gemini ${model} failed, trying next:`, geminiErr);
        }
      }
    }

    // 2. Fallback 1: Groq Cloud
    if (!reply && groqApiKey) {
      const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
      for (const groqModel of groqModels) {
        try {
          const groqMessages = [
            { role: 'system', content: SYSTEM_INSTRUCTION },
          ];
          if (Array.isArray(history)) {
            for (const h of history.slice(-4)) {
              if (h.role && h.text) {
                groqMessages.push({
                  role: h.role === 'user' ? 'user' : 'assistant',
                  content: String(h.text)
                });
              }
            }
          }
          groqMessages.push({ role: 'user', content: message });

          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: groqModel,
              messages: groqMessages,
              temperature: 0.6,
              max_tokens: 650,
            }),
          });

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            const text = groqData.choices?.[0]?.message?.content;
            if (text) {
              reply = text.trim();
              source = `groq (${groqModel})`;
              break;
            }
          }
        } catch (groqErr) {
          console.warn(`[AI Chat] Groq ${groqModel} failed:`, groqErr);
        }
      }
    }

    // 3. Fallback 2: Local Deterministic Offline Knowledge Base
    if (!reply) {
      reply = getOfflineFallbackAnswer(message);
      source = 'offline-knowledge-base';
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        reply,
        source,
      }),
    };
  } catch (error) {
    console.error('[AI Chat] Error:', error);
    // Even on server failure, return verified offline answer
    const fallbackAnswer = getOfflineFallbackAnswer('overview');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        reply: fallbackAnswer,
        source: 'offline-emergency-fallback',
      }),
    };
  }
};
