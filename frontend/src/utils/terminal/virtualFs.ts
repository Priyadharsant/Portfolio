import type { PortfolioData } from '../../types/portfolio';

export type FsNode =
  | {
      type: 'file';
      name: string;
      content: string;
      owner: string;
      permissions: string;
      updatedAt: string;
    }
  | {
      type: 'dir';
      name: string;
      children: Record<string, FsNode>;
      owner: string;
      permissions: string;
      updatedAt: string;
    };

const NOW = 'Nov 28 09:45';

const makeFile = (name: string, content: string, owner = 'priyan'): FsNode => ({
  type: 'file',
  name,
  content,
  owner,
  permissions: '-rw-r--r--',
  updatedAt: NOW,
});

const makeDir = (
  name: string,
  children: Record<string, FsNode> = {},
  owner = 'priyan'
): FsNode => ({
  type: 'dir',
  name,
  children,
  owner,
  permissions: 'drwxr-xr-x',
  updatedAt: NOW,
});

export const createInitialFs = (
  profile: PortfolioData['profile'],
  hero: PortfolioData['hero']
): FsNode => {
  const name = profile?.name || 'Priyadharsan T';
  const title = profile?.title || 'Full-Stack Developer';
  const bio = hero?.kicker || hero?.highlights?.join(' • ') || 'Building scalable web apps and AI-powered experiences.';
  const email = profile?.email || 'contact@portfolio.dev';

  return makeDir('/', {
    home: makeDir('home', {
      priyan: makeDir('priyan', {
        'about.md': makeFile(
          'about.md',
          `# ${name}\nRole: ${title}\n\n${bio}`
        ),
        'skills.txt': makeFile(
          'skills.txt',
          [
            'Frontend : React, TypeScript, Three.js, Tailwind CSS, Framer Motion',
            'Backend  : Node.js, Express, MongoDB, REST APIs',
            'Cloud    : AWS, Docker, Git, CI/CD',
          ].join('\n')
        ),
        'contact.txt': makeFile(
          'contact.txt',
          `Email    : ${email}\nStatus   : Available for opportunities`
        ),
        'socials.txt': makeFile(
          'socials.txt',
          [
            `GitHub   : ${profile?.github || 'https://github.com'}`,
            `LinkedIn : ${profile?.linkedin || 'https://linkedin.com'}`,
            `CodeChef : ${profile?.codechef || 'https://codechef.com'}`,
            `LeetCode : ${profile?.leetcode || 'https://leetcode.com'}`,
          ].join('\n')
        ),
        projects: makeDir('projects', {
          'README.md': makeFile(
            'README.md',
            `# Featured Projects\n\n1. PortfolioOS — Interactive 3D & AI-powered portfolio\n2. Full-Stack MERN Apps — Scalable APIs & real-time dashboards\n\nTip: Run 'ask list my projects' for live details!`
          ),
        }),
      }),
    }),
    etc: makeDir(
      'etc',
      {
        'os-release': makeFile(
          'os-release',
          'NAME="PortfolioOS"\nVERSION="1.0 (Priyan Edition)"\nID=portfolioos\nPRETTY_NAME="PortfolioOS 1.0 LTS"',
          'root'
        ),
        hostname: makeFile('hostname', 'portfolio', 'root'),
      },
      'root'
    ),
    var: makeDir(
      'var',
      {
        log: makeDir(
          'log',
          {
            'boot.log': makeFile(
              'boot.log',
              [
                'npm run dev',
                '✔ server running on port 3021',
                '✔ connected to MongoDB',
                '✔ SMTP service active (Resend)',
                '[api] GET /api/portfolio - 200 OK (12ms)',
              ].join('\n'),
              'root'
            ),
          },
          'root'
        ),
      },
      'root'
    ),
  }, 'root');
};

export const HOME_DIR = '/home/priyan';

export const resolvePath = (cwd: string, target: string): string => {
  if (!target || target === '~') return HOME_DIR;
  let raw = target;
  if (raw.startsWith('~/')) {
    raw = `${HOME_DIR}/${raw.slice(2)}`;
  } else if (!raw.startsWith('/')) {
    raw = `${cwd === '/' ? '' : cwd}/${raw}`;
  }

  const parts = raw.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
};

export const getNodeAtPath = (root: FsNode, absPath: string): FsNode | null => {
  if (absPath === '/') return root;
  const parts = absPath.split('/').filter(Boolean);
  let curr: FsNode = root;
  for (const part of parts) {
    if (curr.type !== 'dir' || !curr.children[part]) {
      return null;
    }
    curr = curr.children[part];
  }
  return curr;
};

export const formatPromptPath = (cwd: string): string => {
  if (cwd === HOME_DIR) return '~';
  if (cwd.startsWith(`${HOME_DIR}/`)) return `~/${cwd.slice(HOME_DIR.length + 1)}`;
  return cwd;
};
