import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import {
  createInitialFs,
  formatPromptPath,
  HOME_DIR,
  type FsNode,
} from '../utils/terminal/virtualFs';
import {
  executeLocalCommand,
  getAutocompleteSuggestions,
  type TerminalLine,
} from '../utils/terminal/shellCommands';

type InteractiveTerminalProps = {
  profile: PortfolioData['profile'];
  hero: PortfolioData['hero'];
};

type HistoryEntry = {
  prompt?: string;
  command?: string;
  lines: TerminalLine[];
};

const INITIAL_ENTRIES: HistoryEntry[] = [
  {
    prompt: 'priyan@portfolio:~$',
    command: 'npm run dev',
    lines: [
      { text: '✔ server running on port 3021', tone: 'success' },
      { text: '✔ connected to MongoDB', tone: 'success' },
      { text: '✔ SMTP service active (Resend)', tone: 'success' },
      { text: '[api] GET /api/portfolio - 200 OK (12ms)', tone: 'info' },
      { text: "Type 'help' or any Linux command...", tone: 'muted' },
    ],
  },
];

const toneClass: Record<NonNullable<TerminalLine['tone']>, string> = {
  normal: 'text-slate-700 dark:text-slate-300',
  success: 'text-emerald-600 dark:text-emerald-400 font-medium',
  info: 'text-teal-600 dark:text-teal-400',
  error: 'text-rose-500 dark:text-rose-400',
  muted: 'text-slate-400 dark:text-slate-500',
  dir: 'text-blue-600 dark:text-blue-400 font-semibold',
};

const InteractiveTerminal = ({ profile, hero }: InteractiveTerminalProps) => {
  const [fs, setFs] = useState<FsNode>(() => createInitialFs(profile, hero));
  const [cwd, setCwd] = useState<string>(HOME_DIR);
  const [entries, setEntries] = useState<HistoryEntry[]>(INITIAL_ENTRIES);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>(['npm run dev']);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [entries, isLoading]);

  const promptLabel = `priyan@portfolio:${formatPromptPath(cwd)}$`;

  const runCommand = async (raw: string) => {
    const trimmed = raw.trim();
    const currentPrompt = promptLabel;

    if (!trimmed) {
      setEntries((prev) => [...prev, { prompt: currentPrompt, command: '', lines: [] }]);
      return;
    }

    const nextHistory = [...cmdHistory, trimmed];
    setCmdHistory(nextHistory);
    setHistoryIdx(-1);

    const result = executeLocalCommand(trimmed, cwd, fs, nextHistory, profile);

    if (result.clear) {
      setEntries([]);
      return;
    }

    if (result.nextCwd) setCwd(result.nextCwd);
    if (result.nextFs) setFs(result.nextFs);

    if (!result.needsAi) {
      setEntries((prev) => [
        ...prev,
        { prompt: currentPrompt, command: trimmed, lines: result.lines },
      ]);
      return;
    }

    setEntries((prev) => [...prev, { prompt: currentPrompt, command: trimmed, lines: [] }]);
    setIsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/terminal/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: result.aiQuery || trimmed, cwd }),
      });
      const data = await res.json();
      const outputText: string =
        data?.output || `bash: ${trimmed.split(' ')[0]}: command not found`;
      const aiLines: TerminalLine[] = outputText
        .split('\n')
        .map((line) => ({ text: line, tone: 'normal' }));

      setEntries((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          prompt: currentPrompt,
          command: trimmed,
          lines: aiLines,
        };
        return updated;
      });
    } catch {
      const cmdName = trimmed.split(' ')[0];
      setEntries((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          prompt: currentPrompt,
          command: trimmed,
          lines: [
            { text: `bash: ${cmdName}: command not found`, tone: 'error' },
            { text: "Try 'help', 'ls', 'cat about.md', or 'neofetch'.", tone: 'muted' },
          ],
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLoading) return;
      const val = input;
      setInput('');
      void runCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx >= cmdHistory.length - 1) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = getAutocompleteSuggestions(input, cwd, fs);
      if (matches.length === 1) {
        const parts = input.split(' ');
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(' ') + (parts.length === 1 ? ' ' : ''));
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      setEntries((prev) => [
        ...prev,
        { prompt: promptLabel, command: `${input}^C`, lines: [] },
      ]);
      setInput('');
    }
  };

  return (
    <motion.div
      className="absolute -bottom-10 -right-8 w-[320px] rounded-xl border border-slate-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#070a10]/90 dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-20"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      whileHover={{ y: -3 }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
            terminal
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>

      {/* Scrollable Terminal Body */}
      <div
        ref={scrollRef}
        className="p-3.5 h-[190px] overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-1.5 cursor-text terminal-scrollbar"
      >
        {entries.map((entry, idx) => (
          <div key={idx} className="space-y-0.5">
            {entry.prompt !== undefined && (
              <div className="flex gap-1.5 items-start break-all">
                <span className="text-teal-500 dark:text-teal-400 shrink-0">
                  {entry.prompt}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {entry.command}
                </span>
              </div>
            )}
            {entry.lines.map((line, lIdx) => (
              <div
                key={lIdx}
                className={`whitespace-pre-wrap break-words ${toneClass[line.tone || 'normal']}`}
              >
                {line.text}
              </div>
            ))}
          </div>
        ))}

        {isLoading && (
          <div className="text-teal-500 dark:text-teal-400 animate-pulse">
            running...
          </div>
        )}

        {/* Active Input Prompt (shown after response finishes) */}
        {!isLoading && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-teal-500 dark:text-teal-400 shrink-0">
              {promptLabel}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command input"
              className="w-full bg-transparent outline-none border-none font-mono text-[10px] text-slate-800 dark:text-slate-200 caret-teal-400"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InteractiveTerminal;
