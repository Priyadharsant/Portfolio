import type { PortfolioData } from '../../types/portfolio';
import {
  type FsNode,
  HOME_DIR,
  getNodeAtPath,
  resolvePath,
} from './virtualFs';

export type TerminalLine = {
  text: string;
  tone?: 'normal' | 'success' | 'info' | 'error' | 'muted' | 'dir';
};

export type CommandResult = {
  lines: TerminalLine[];
  nextCwd?: string;
  nextFs?: FsNode;
  clear?: boolean;
  needsAi?: boolean;
  aiQuery?: string;
};

const BUILTIN_COMMANDS = [
  'help',
  'ls',
  'cd',
  'pwd',
  'cat',
  'echo',
  'mkdir',
  'touch',
  'rm',
  'grep',
  'whoami',
  'id',
  'uname',
  'date',
  'uptime',
  'env',
  'neofetch',
  'history',
  'clear',
  'man',
  'ask',
];

const cloneFs = (node: FsNode): FsNode => structuredClone(node);

export const executeLocalCommand = (
  rawInput: string,
  cwd: string,
  fs: FsNode,
  history: string[],
  profile: PortfolioData['profile']
): CommandResult => {
  const trimmed = rawInput.trim();
  if (!trimmed) return { lines: [] };

  // Handle basic output redirection: echo "text" > file or >> file
  const redirectMatch = trimmed.match(/^echo\s+(.+?)\s*(>>?)\s*(\S+)$/);
  if (redirectMatch) {
    const [, rawText, op, target] = redirectMatch;
    const content = rawText.replace(/^["']|["']$/g, '');
    const absPath = resolvePath(cwd, target);
    const parentPath = absPath.split('/').slice(0, -1).join('/') || '/';
    const fileName = absPath.split('/').pop() || '';
    const nextFs = cloneFs(fs);
    const parent = getNodeAtPath(nextFs, parentPath);

    if (!parent || parent.type !== 'dir' || !fileName) {
      return { lines: [{ text: `bash: ${target}: No such file or directory`, tone: 'error' }] };
    }
    const existing = parent.children[fileName];
    if (existing && existing.type === 'dir') {
      return { lines: [{ text: `bash: ${target}: Is a directory`, tone: 'error' }] };
    }
    const prev = existing?.type === 'file' && op === '>>' ? `${existing.content}\n` : '';
    parent.children[fileName] = {
      type: 'file',
      name: fileName,
      content: `${prev}${content}`,
      owner: 'priyan',
      permissions: '-rw-r--r--',
      updatedAt: 'Nov 28 09:50',
    };
    return { lines: [], nextFs };
  }

  const parts = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  const cmd = parts[0]?.toLowerCase() || '';
  const args = parts.slice(1).map((a) => a.replace(/^["']|["']$/g, ''));

  switch (cmd) {
    case 'clear':
      return { lines: [], clear: true };

    case 'pwd':
      return { lines: [{ text: cwd, tone: 'normal' }] };

    case 'whoami':
      return { lines: [{ text: `priyan (${profile?.name || 'Priyadharsan T'})`, tone: 'info' }] };

    case 'id':
      return {
        lines: [
          {
            text: 'uid=1000(priyan) gid=1000(priyan) groups=1000(priyan),27(sudo),999(portfolio)',
            tone: 'normal',
          },
        ],
      };

    case 'uname':
      return {
        lines: [
          {
            text: args.includes('-a')
              ? 'PortfolioOS portfolio 6.8.0-priyan #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'
              : 'PortfolioOS',
            tone: 'normal',
          },
        ],
      };

    case 'date':
      return { lines: [{ text: new Date().toUTCString(), tone: 'normal' }] };

    case 'uptime':
      return {
        lines: [
          {
            text: ' 09:55:00 up 99 days, 14:22,  1 user,  load average: 0.08, 0.12, 0.09',
            tone: 'normal',
          },
        ],
      };

    case 'env':
      return {
        lines: [
          { text: `USER=priyan`, tone: 'normal' },
          { text: `HOME=${HOME_DIR}`, tone: 'normal' },
          { text: `PWD=${cwd}`, tone: 'normal' },
          { text: `SHELL=/bin/bash`, tone: 'normal' },
          { text: `ROLE=${profile?.title || 'Full-Stack Developer'}`, tone: 'info' },
          { text: `PORTFOLIO_STATUS=AVAILABLE_FOR_HIRE`, tone: 'success' },
        ],
      };

    case 'history':
      return {
        lines: history.map((h, i) => ({
          text: `  ${String(i + 1).padStart(3, ' ')}  ${h}`,
          tone: 'muted',
        })),
      };

    case 'echo':
      return { lines: [{ text: args.join(' '), tone: 'normal' }] };

    case 'help':
      return {
        lines: [
          { text: 'PortfolioOS Shell — Available Commands:', tone: 'info' },
          { text: '  ls [-la] [dir]   List directory contents', tone: 'normal' },
          { text: '  cd [dir]         Change directory (~, .., /)', tone: 'normal' },
          { text: '  cat <file>       Read file (about.md, skills.txt...)', tone: 'normal' },
          { text: '  pwd              Print working directory', tone: 'normal' },
          { text: '  mkdir / touch    Create folder or file', tone: 'normal' },
          { text: '  neofetch         Portfolio system summary', tone: 'normal' },
          { text: '  whoami / env     Owner & portfolio environment', tone: 'normal' },
          { text: '  ask <question>   Ask AI about my portfolio', tone: 'success' },
          { text: '  clear            Clear terminal (or Ctrl+L)', tone: 'muted' },
          { text: 'Tip: Any Linux cmd (ps, df, git log) uses AI!', tone: 'muted' },
        ],
      };

    case 'man': {
      const target = args[0];
      if (!target) {
        return { lines: [{ text: 'What manual page do you want?', tone: 'error' }] };
      }
      return {
        lines: [
          { text: `PORTFOLIO(1)          PortfolioOS Manual          PORTFOLIO(1)`, tone: 'info' },
          { text: `NAME: ${target} — simulated Linux command grounded in Priyan's portfolio.`, tone: 'normal' },
          { text: `TIP : Try '${target}' directly or 'ask about ${target}'.`, tone: 'muted' },
        ],
      };
    }

    case 'neofetch':
      return {
        lines: [
          { text: `   ____            __  ____      ___      `, tone: 'info' },
          { text: `  / __ \\___  _____/ /_/ __/__   / (_)___  `, tone: 'info' },
          { text: ` / /_/ / _ \\/ ___/ __/ /_/ _ \\ / / / __ \\ `, tone: 'info' },
          { text: `/ ____/ (_) / /  / /_/ __/ (_) / / / /_/ / `, tone: 'info' },
          { text: `priyan@portfolio`, tone: 'success' },
          { text: `----------------`, tone: 'muted' },
          { text: `OS     : PortfolioOS 1.0 LTS`, tone: 'normal' },
          { text: `Owner  : ${profile?.name || 'Priyadharsan T'}`, tone: 'normal' },
          { text: `Role   : ${profile?.title || 'Full-Stack Developer'}`, tone: 'normal' },
          { text: `Stack  : React, TS, Node.js, MongoDB, AWS`, tone: 'normal' },
          { text: `Shell  : bash 5.2 (AI-enabled)`, tone: 'normal' },
        ],
      };

    case 'cd': {
      const target = args[0] || '~';
      const nextCwd = resolvePath(cwd, target);
      const node = getNodeAtPath(fs, nextCwd);
      if (!node) {
        return { lines: [{ text: `bash: cd: ${target}: No such file or directory`, tone: 'error' }] };
      }
      if (node.type !== 'dir') {
        return { lines: [{ text: `bash: cd: ${target}: Not a directory`, tone: 'error' }] };
      }
      return { lines: [], nextCwd };
    }

    case 'ls': {
      const flags = args.filter((a) => a.startsWith('-')).join('');
      const showAll = flags.includes('a');
      const longFmt = flags.includes('l');
      const pathArg = args.find((a) => !a.startsWith('-')) || '.';
      const absPath = resolvePath(cwd, pathArg);
      const node = getNodeAtPath(fs, absPath);

      if (!node) {
        return { lines: [{ text: `ls: cannot access '${pathArg}': No such file or directory`, tone: 'error' }] };
      }
      if (node.type === 'file') {
        return { lines: [{ text: node.name, tone: 'normal' }] };
      }

      const entries = Object.values(node.children).sort((a, b) => a.name.localeCompare(b.name));
      if (!longFmt) {
        const names = entries.map((e) => (e.type === 'dir' ? `${e.name}/` : e.name));
        return {
          lines: names.length
            ? [{ text: names.join('   '), tone: 'dir' }]
            : [],
        };
      }

      const lines: TerminalLine[] = [];
      if (showAll) {
        lines.push({ text: `drwxr-xr-x  priyan  4096  .`, tone: 'dir' });
        lines.push({ text: `drwxr-xr-x  root    4096  ..`, tone: 'dir' });
      }
      for (const entry of entries) {
        const size = entry.type === 'dir' ? 4096 : entry.content.length;
        lines.push({
          text: `${entry.permissions}  ${entry.owner.padEnd(6, ' ')}  ${String(size).padStart(4, ' ')}  ${entry.name}${entry.type === 'dir' ? '/' : ''}`,
          tone: entry.type === 'dir' ? 'dir' : 'normal',
        });
      }
      return { lines };
    }

    case 'cat': {
      const target = args[0];
      if (!target) {
        return { lines: [{ text: 'cat: missing file operand', tone: 'error' }] };
      }
      const absPath = resolvePath(cwd, target);
      const node = getNodeAtPath(fs, absPath);
      if (!node) {
        return { lines: [{ text: `cat: ${target}: No such file or directory`, tone: 'error' }] };
      }
      if (node.type === 'dir') {
        return { lines: [{ text: `cat: ${target}: Is a directory`, tone: 'error' }] };
      }
      return {
        lines: node.content.split('\n').map((line) => ({ text: line, tone: 'normal' })),
      };
    }

    case 'mkdir': {
      const target = args[0];
      if (!target) return { lines: [{ text: 'mkdir: missing operand', tone: 'error' }] };
      const absPath = resolvePath(cwd, target);
      const parentPath = absPath.split('/').slice(0, -1).join('/') || '/';
      const dirName = absPath.split('/').pop() || '';
      const nextFs = cloneFs(fs);
      const parent = getNodeAtPath(nextFs, parentPath);
      if (!parent || parent.type !== 'dir') {
        return { lines: [{ text: `mkdir: cannot create directory '${target}': No such file or directory`, tone: 'error' }] };
      }
      if (parent.children[dirName]) {
        return { lines: [{ text: `mkdir: cannot create directory '${target}': File exists`, tone: 'error' }] };
      }
      parent.children[dirName] = {
        type: 'dir',
        name: dirName,
        children: {},
        owner: 'priyan',
        permissions: 'drwxr-xr-x',
        updatedAt: 'Nov 28 09:50',
      };
      return { lines: [], nextFs };
    }

    case 'touch': {
      const target = args[0];
      if (!target) return { lines: [{ text: 'touch: missing file operand', tone: 'error' }] };
      const absPath = resolvePath(cwd, target);
      const parentPath = absPath.split('/').slice(0, -1).join('/') || '/';
      const fileName = absPath.split('/').pop() || '';
      const nextFs = cloneFs(fs);
      const parent = getNodeAtPath(nextFs, parentPath);
      if (!parent || parent.type !== 'dir') {
        return { lines: [{ text: `touch: cannot touch '${target}': No such file or directory`, tone: 'error' }] };
      }
      if (!parent.children[fileName]) {
        parent.children[fileName] = {
          type: 'file',
          name: fileName,
          content: '',
          owner: 'priyan',
          permissions: '-rw-r--r--',
          updatedAt: 'Nov 28 09:50',
        };
      }
      return { lines: [], nextFs };
    }

    case 'rm': {
      const recursive = args.includes('-r') || args.includes('-rf');
      const target = args.find((a) => !a.startsWith('-'));
      if (!target) return { lines: [{ text: 'rm: missing operand', tone: 'error' }] };
      const absPath = resolvePath(cwd, target);
      const parentPath = absPath.split('/').slice(0, -1).join('/') || '/';
      const name = absPath.split('/').pop() || '';
      const nextFs = cloneFs(fs);
      const parent = getNodeAtPath(nextFs, parentPath);
      const node = parent?.type === 'dir' ? parent.children[name] : null;
      if (!parent || parent.type !== 'dir' || !node) {
        return { lines: [{ text: `rm: cannot remove '${target}': No such file or directory`, tone: 'error' }] };
      }
      if (node.type === 'dir' && !recursive) {
        return { lines: [{ text: `rm: cannot remove '${target}': Is a directory`, tone: 'error' }] };
      }
      delete parent.children[name];
      return { lines: [], nextFs };
    }

    case 'grep': {
      const pattern = args[0];
      const target = args[1];
      if (!pattern || !target) {
        return { lines: [{ text: 'Usage: grep <pattern> <file>', tone: 'error' }] };
      }
      const node = getNodeAtPath(fs, resolvePath(cwd, target));
      if (!node || node.type !== 'file') {
        return { lines: [{ text: `grep: ${target}: No such file`, tone: 'error' }] };
      }
      const matches = node.content
        .split('\n')
        .filter((l) => l.toLowerCase().includes(pattern.toLowerCase()));
      return {
        lines: matches.map((m) => ({ text: m, tone: 'success' })),
      };
    }

    case 'ask': {
      const query = args.join(' ').trim();
      if (!query) {
        return { lines: [{ text: 'Usage: ask <question about my portfolio>', tone: 'info' }] };
      }
      return { lines: [], needsAi: true, aiQuery: trimmed };
    }

    default:
      // Any unrecognized Linux command or natural-language query goes to AI
      return { lines: [], needsAi: true, aiQuery: trimmed };
  }
};

export const getAutocompleteSuggestions = (
  input: string,
  cwd: string,
  fs: FsNode
): string[] => {
  const parts = input.split(' ');
  if (parts.length <= 1) {
    const prefix = parts[0] || '';
    return BUILTIN_COMMANDS.filter((c) => c.startsWith(prefix));
  }
  const last = parts[parts.length - 1] || '';
  const dirNode = getNodeAtPath(fs, cwd);
  if (!dirNode || dirNode.type !== 'dir') return [];
  return Object.keys(dirNode.children).filter((name) => name.startsWith(last));
};
