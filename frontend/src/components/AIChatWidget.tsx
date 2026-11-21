import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  User,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  MessageCircle,
  Code2,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { sendAIChatMessage, type ChatHistoryItem } from '../utils/api';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source?: string;
  timestamp: string;
};

const SUGGESTED_QUESTIONS = [
  'What are your core technical skills?',
  'Tell me about your featured projects',
  'What is your experience as Backend TL?',
  'How can I get in touch with you?',
];

const FOLLOWUP_ICONS = [ArrowUpRight, MessageCircle, Code2, Compass, CheckCircle2];

const OFFLINE_FALLBACK_MESSAGES = [
  "Hi! I'm Priyadharsan, a Full-Stack Software Engineer & Backend Team Lead skilled in React, TypeScript, Node.js, Express, MongoDB, and AWS. Check out my featured projects below or reach out via the Contact section!",
  "I specialize in scalable backend architectures, APIs, and modern responsive frontends with React and Node.js. Feel free to explore my repositories or get in touch!",
  "I'm a B.Tech Artificial Intelligence & Data Science student and WebOps Lead at Velammal Engineering College. Explore my projects below or drop me a message directly in the Contact form!",
  "Welcome! I build scalable web platforms and reliable cloud systems. You can preview my live projects or view my verified resume directly on this page!"
];

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "👋 Hi there! I'm Priyadharsan. Feel free to ask me anything about my projects, technical skills, background, or how we can collaborate!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload: ChatHistoryItem[] = messages.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await sendAIChatMessage(query, historyPayload);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: res.reply || "I'm having a slight delay connecting to the AI model, but feel free to ask about my skills, projects, or background!",
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnreadCount((c) => c + 1);
    } catch {
      const randomFallback =
        OFFLINE_FALLBACK_MESSAGES[Math.floor(Math.random() * OFFLINE_FALLBACK_MESSAGES.length)];
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: randomFallback,
        source: 'local-offline',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Chat cleared. What else would you like to know about my work, projects, or skills?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderFormattedText = (content: string, isLastMessage: boolean = false) => {
    // Check if response contains follow-up quick questions
    let mainBody = content;
    let quickQuestions: string[] = [];

    const qqMatch = content.match(/(?:Quick Questions|Related Questions|Suggested Questions):?\s*([\s\S]*)$/i);
    if (qqMatch) {
      mainBody = content.substring(0, qqMatch.index).trim();
      const rawList = qqMatch[1].trim();
      quickQuestions = rawList
        .split('\n')
        .map((line) => line.replace(/^[-•*0-9.)\s]+/, '').trim())
        .filter((line) => line.length > 0 && line.endsWith('?'));
    }

    // Helper to format inline elements: Markdown links, bare URLs, emails, and bold text
    const formatSegment = (text: string) => {
      const tokenRegex = /(\[.*?\]\(.*?\)|\bhttps?:\/\/[^\s<>)"]+|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b|\*\*.*?\*\*)/g;
      const tokens = text.split(tokenRegex);

      return tokens.map((token, idx) => {
        if (!token) return null;

        // 1. Markdown link [text](url)
        if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
          const m = token.match(/^\[(.*?)\]\((.*?)\)$/);
          if (m) {
            const [, linkText, linkUrl] = m;
            return (
              <a
                key={idx}
                href={linkUrl}
                target={linkUrl.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-teal-600 underline hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 break-all"
              >
                {linkText}
                {linkUrl.startsWith('http') && <ExternalLink className="h-3 w-3 inline flex-none" />}
              </a>
            );
          }
        }

        // 2. Bare URL https://...
        if (token.startsWith('http://') || token.startsWith('https://')) {
          return (
            <a
              key={idx}
              href={token}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-teal-600 underline hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 break-all"
            >
              {token}
              <ExternalLink className="h-3 w-3 inline flex-none" />
            </a>
          );
        }

        // 3. Email address
        if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(token)) {
          return (
            <a
              key={idx}
              href={`mailto:${token}`}
              className="font-semibold text-teal-600 underline hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 break-all"
            >
              {token}
            </a>
          );
        }

        // 4. Bold **text**
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
              {token.slice(2, -2)}
            </strong>
          );
        }

        return <span key={idx}>{token}</span>;
      });
    };

    const lines = mainBody.split('\n');
    return (
      <div className="space-y-1.5">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();

          // Markdown headings (### or ## or #)
          if (trimmed.startsWith('#')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4 key={lIdx} className="font-bold text-sm text-slate-900 dark:text-white pt-1.5 pb-0.5 border-b border-slate-200/50 dark:border-white/5">
                {formatSegment(headingText)}
              </h4>
            );
          }

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            return <hr key={lIdx} className="my-1.5 border-slate-200/60 dark:border-white/10" />;
          }

          // Bullet list items (* or - or •)
          if (/^[-*•]\s+/.test(trimmed)) {
            const bulletContent = trimmed.replace(/^[-*•]\s+/, '');
            return (
              <div key={lIdx} className="flex items-start gap-1.5 pl-1 leading-relaxed">
                <span className="text-teal-600 dark:text-teal-400 font-bold mt-0.5">•</span>
                <span className="flex-1">{formatSegment(bulletContent)}</span>
              </div>
            );
          }

          return (
            <span key={lIdx} className="block leading-relaxed">
              {formatSegment(line)}
            </span>
          );
        })}

        {/* Dynamic Clickable Follow-up Chips - Rendered ONLY on the latest/last assistant message */}
        {isLastMessage && quickQuestions.length > 0 && (
          <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 dark:border-white/10 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Quick Follow-ups:
            </p>
            <div className="flex flex-col gap-1.5">
              {quickQuestions.map((q, idx) => {
                const IconComponent = FOLLOWUP_ICONS[idx % FOLLOWUP_ICONS.length];
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="group w-full flex items-center gap-2 text-left rounded-lg border border-teal-500/25 bg-teal-50/70 px-3 py-1.5 text-xs font-medium text-teal-900 transition-all hover:bg-teal-100/90 hover:border-teal-500/50 active:scale-[0.98] dark:border-teal-400/30 dark:bg-teal-950/40 dark:text-teal-200 dark:hover:bg-teal-900/60 dark:hover:border-teal-400/60"
                  >
                    <IconComponent className="h-3.5 w-3.5 flex-none text-teal-600 transition-transform group-hover:scale-110 dark:text-teal-400" />
                    <span className="flex-1">{q}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Pill - Distinct contrast in both light & dark modes with crisp glowing accents */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-6 z-50 flex items-center">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex h-10 sm:h-11 items-center gap-2 rounded-full border border-teal-500/40 bg-white/95 px-3.5 sm:px-4 text-slate-900 shadow-[0_6px_25px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:bg-white hover:shadow-[0_12px_40px_rgba(20,184,166,0.25)] active:translate-y-0 dark:border-teal-400/60 dark:bg-[#0c1222] dark:text-white dark:shadow-[0_0_20px_rgba(20,184,166,0.25)] dark:hover:border-teal-300 dark:hover:bg-[#11192e]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chat with Priyadharsan"
        >
          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 transition-transform group-hover:scale-110 dark:text-teal-400" />
          
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Chat with Me
          </span>

          {unreadCount > 0 && (
            <span className="flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-teal-500 text-[8px] sm:text-[9px] font-bold text-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Responsive Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-20 z-[70] mx-auto flex max-h-[82vh] w-auto flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#06070b]/95 sm:bottom-20 sm:right-5 sm:left-auto sm:mx-0 sm:w-[410px] sm:max-h-[580px]"
            style={{
              maxHeight: 'calc(100dvh - 100px)',
            }}
          >
            {/* Header: High Contrast Black & White / Theme Optimized */}
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 py-3.5 backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-500/25 bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Chat with Priyadharsan
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Direct portfolio & project inquiries
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  title="Clear conversation"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area - Scrollable with Hidden Scrollbar */}
            <div className="no-scrollbar flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
              {messages.map((msg, index) => {
                const isLastAssistantMessage =
                  msg.role === 'assistant' &&
                  !isLoading &&
                  (index === messages.length - 1 ||
                    messages.slice(index + 1).every((m) => m.role === 'user'));

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-teal-500/30 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white dark:from-teal-500 dark:to-cyan-600'
                          : 'border border-slate-200/90 bg-slate-50/90 text-slate-800 dark:border-white/10 dark:bg-[#0f1422] dark:text-slate-200'
                      }`}
                    >
                      <div>{renderFormattedText(msg.text, isLastAssistantMessage)}</div>
                      
                      <div className="mt-1 flex items-center justify-end text-[10px] opacity-50">
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-teal-500/30 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-[#0f1422]">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Suggestions - Visible ONLY on initial welcome before user sends first message */}
            {messages.length === 1 && (
              <div className="border-t border-slate-200/70 bg-slate-50/50 p-2 dark:border-white/5 dark:bg-white/[0.01]">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Suggested topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 transition-colors hover:border-teal-500 hover:text-teal-700 dark:border-white/10 dark:bg-[#0d121f] dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-[#06070b]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400 dark:focus:bg-[#0d121f]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-500/20 transition-all hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none dark:bg-teal-500 dark:hover:bg-teal-600"
                  aria-label="Send query"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
