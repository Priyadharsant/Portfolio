import type { Ref } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Code2, Eye, Github, Linkedin, Mail, ArrowRight, Sparkles, Cloud, Layout, Server, Database, Terminal, FileCode, Cpu } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { fadeUp, staggerContainer } from '../utils/motion';
import { useTooltip } from './TooltipContext';

type HeroProps = {
    profile: PortfolioData['profile'];
    hero: PortfolioData['hero'];
    nameRef?: Ref<HTMLHeadingElement>;

};

const particles = Array.from({ length: 35 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    size: Math.random() * 4 + 1,
    blur: Math.random() * 3,
    isTeal: Math.random() > 0.4
}));

const stackBadges = [
    { name: 'React', icon: Layout, color: 'text-cyan-500 border-cyan-500/20 shadow-cyan-500/5 hover:border-cyan-500/50 hover:shadow-cyan-500/10 dark:text-cyan-400 dark:border-cyan-400/20 dark:hover:border-cyan-400/50 dark:hover:shadow-cyan-400/20', position: 'top-10 -left-16', delay: 0, duration: 4.5 },
    { name: 'Node.js', icon: Cpu, color: 'text-green-500 border-green-500/20 shadow-green-500/5 hover:border-green-500/50 hover:shadow-green-500/10 dark:text-green-400 dark:border-green-400/20 dark:hover:border-green-400/50 dark:hover:shadow-green-400/20', position: 'top-16 -right-16', delay: 0.8, duration: 5 },
    { name: 'MongoDB', icon: Database, color: 'text-emerald-500 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-500/50 hover:shadow-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20 dark:hover:border-emerald-400/50 dark:hover:shadow-emerald-400/20', position: 'bottom-28 -right-12', delay: 1.2, duration: 4.8 },
    { name: 'Express', icon: Server, color: 'text-indigo-500 border-indigo-500/20 shadow-indigo-500/5 hover:border-indigo-500/50 hover:shadow-indigo-500/10 dark:text-indigo-400 dark:border-indigo-400/20 dark:hover:border-indigo-400/50 dark:hover:shadow-indigo-400/20', position: 'bottom-16 -left-14', delay: 0.4, duration: 5.2 },
    { name: 'AWS Cloud', icon: Cloud, color: 'text-amber-500 border-amber-500/20 shadow-amber-500/5 hover:border-amber-500/50 hover:shadow-amber-500/10 dark:text-amber-400 dark:border-amber-400/20 dark:hover:border-amber-400/50 dark:hover:shadow-amber-400/20', position: '-top-12 left-1/3', delay: 1.5, duration: 5.5 },
];

const codeLines = [
    { line: 1, content: <span className="text-[#8b5cf6] dark:text-[#a78bfa]">import</span>, hasIndent: false, extra: <span> {'{'} <span className="text-[#06b6d4] dark:text-[#22d3ee]">PortfolioServer</span> {'}'} <span className="text-[#8b5cf6] dark:text-[#a78bfa]">from</span> <span className="text-[#10b981] dark:text-[#34d399]">"@priya/core"</span>;</span> },
    { line: 2, content: <span></span>, hasIndent: false },
    { line: 3, content: <span className="text-[#8b5cf6] dark:text-[#a78bfa]">const</span>, hasIndent: false, extra: <span> server = <span className="text-[#3b82f6] dark:text-[#60a5fa]">new</span> <span className="text-[#3b82f6] dark:text-[#60a5fa]">PortfolioServer</span>({'{'}</span> },
    { line: 4, content: <span className="text-[#f43f5e] dark:text-[#fb7185]">port</span>, hasIndent: true, extra: <span>: <span className="text-[#f59e0b]">3021</span>,</span> },
    { line: 5, content: <span className="text-[#f43f5e] dark:text-[#fb7185]">database</span>, hasIndent: true, extra: <span>: <span className="text-[#10b981] dark:text-[#34d399]">"mongodb://localhost/db"</span>,</span> },
    { line: 6, content: <span className="text-[#f43f5e] dark:text-[#fb7185]">features</span>, hasIndent: true, extra: <span>: [<span className="text-[#10b981] dark:text-[#34d399]">"Express"</span>, <span className="text-[#10b981] dark:text-[#34d399]">"Secure_Mail"</span>]</span> },
    { line: 7, content: <span>{'}'});</span>, hasIndent: false },
    { line: 8, content: <span></span>, hasIndent: false },
    { line: 9, content: <span className="text-[#8b5cf6] dark:text-[#a78bfa]">await</span>, hasIndent: false, extra: <span> server.<span className="text-[#d97706] dark:text-[#fbbf24]">start</span>();</span> },
    { line: 10, content: <span className="text-[#64748b]">console</span>, hasIndent: false, extra: <span>.<span className="text-[#d97706] dark:text-[#fbbf24]">log</span>(<span className="text-[#10b981] dark:text-[#34d399]">"🚀 Ready!"</span>);</span> },
];

const terminalLogs = [
    { text: 'npm run dev', color: 'text-slate-700 dark:text-slate-300 font-semibold' },
    { text: '✔ server running on port 3021', color: 'text-emerald-600 dark:text-emerald-400 font-medium' },
    { text: '✔ connected to MongoDB', color: 'text-emerald-600 dark:text-emerald-400 font-medium' },
    { text: '✔ SMTP service active (Resend)', color: 'text-emerald-600 dark:text-emerald-400 font-medium' },
    { text: '[api] GET /api/portfolio - 200 OK (12ms)', color: 'text-teal-600 dark:text-teal-400 text-[10px]' }
];

const Hero = ({ profile, hero, nameRef }: HeroProps) => {
    const { showTooltip, hideTooltip } = useTooltip();
    const socials = [
        { label: 'GitHub', title: 'View my GitHub profile', href: profile.github, icon: Github },
        { label: 'LinkedIn', title: 'Connect on LinkedIn', href: profile.linkedin, icon: Linkedin },
        { label: 'CodeChef', title: 'View my CodeChef profile', href: profile.codechef, icon: ChefHat },
        { label: 'LeetCode', title: 'View my LeetCode profile', href: profile.leetcode, icon: Code2 },
        { label: 'Email', title: 'Send me an email', href: `mailto:${profile.email}`, icon: Mail },
    ];

    return (
        <section className="relative min-h-screen overflow-hidden border-b border-slate-200/80 bg-[#f8fbff] dark:border-white/5 dark:bg-[#06070b]">
            {/* --- ANIMATED BACKGROUND START --- */}
            <motion.div
                className="absolute -left-[10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-teal-400/20 blur-[120px] pointer-events-none dark:bg-teal-500/10 dark:blur-[120px]"
                animate={{ x: [0, 50, 0, -50, 0], y: [0, 30, 60, 30, 0], scale: [1, 1.1, 1, 0.9, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute -right-[10%] bottom-[-10%] h-[40rem] w-[40rem] rounded-full bg-sky-400/20 blur-[120px] pointer-events-none dark:bg-cyan-500/10 dark:blur-[120px]"
                animate={{ x: [0, -50, 0, 50, 0], y: [0, -30, -60, -30, 0], scale: [1, 0.9, 1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />


            {/* Dotted Sci-Fi Mesh Grid */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.18)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]"
                animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* 3D Depth Particles (Bokeh Effect) */}
                {particles.map((particle, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className={`absolute rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)] dark:shadow-[0_0_12px_rgba(20,184,166,0.35)] ${particle.isTeal ? 'bg-teal-500/80 dark:bg-teal-300/80' : 'bg-sky-500/80 dark:bg-sky-300/80'}`}
                        style={{ 
                            top: particle.top, 
                            left: particle.left, 
                            width: particle.size, 
                            height: particle.size,
                            filter: `blur(${particle.blur}px)`
                        }}
                        animate={{ 
                            y: [0, -120], 
                            opacity: [0, 0.8, 0], 
                            scale: [0, 1.5, 0] 
                        }}
                        transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
                    />
                ))}

                {/* Existing highlight blurs around code window */}
                <motion.div
                    className="absolute left-[18%] top-[22%] h-14 w-14 rounded-full bg-teal-300/30 blur-2xl opacity-90"
                    animate={{ x: [0, 24, 0, -24, 0], y: [0, -16, 0, 16, 0], scale: [1, 1.08, 1, 0.95, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute right-[18%] top-[30%] h-12 w-12 rounded-full bg-sky-300/30 blur-2xl opacity-90"
                    animate={{ x: [0, -18, 0, 18, 0], y: [0, 18, 0, -18, 0], scale: [1, 0.96, 1, 1.05, 1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            {/* --- ANIMATED BACKGROUND END --- */}

            <div className="section-shell relative grid min-h-screen grid-cols-1 items-center gap-16 pt-24 lg:grid-cols-2 lg:gap-8 lg:pt-0">
                {/* Text Content */}
                <motion.div
                    className="max-w-2xl"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50/90 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-sm shadow-[0_0_20px_rgba(20,184,166,0.12)] dark:bg-teal-500/10 dark:text-teal-300 dark:shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                        <Sparkles className="h-4 w-4" />
                        {hero.kicker}
                    </motion.div>

                    <motion.h1
                        ref={nameRef}
                        variants={fadeUp}
                        className="text-5xl font-black leading-tight tracking-tight text-slate-950 dark:text-slate-100 sm:text-7xl"
                    >
                        {profile.name}
                    </motion.h1>

                    <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-600 to-blue-600 dark:from-teal-300 dark:via-cyan-400 dark:to-blue-500 sm:text-4xl">
                        {profile.title}
                    </motion.h2>

                    <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-slate-700 dark:text-slate-400 sm:text-xl max-w-xl">
                        {profile.tagline}
                    </motion.p>

                    <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <motion.a
                            href="/resume"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-12 transform-gpu items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 font-semibold text-white transition-[box-shadow,transform] duration-150 will-change-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(20,184,166,0.32)] focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] dark:from-teal-400 dark:to-cyan-500 dark:text-slate-950 dark:hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] dark:focus:ring-teal-400 dark:focus:ring-offset-[#06070b]"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Eye className="h-5 w-5" />
                            View Resume
                        </motion.a>
                        <motion.a
                            href="#projects"
                            className="group inline-flex h-12 transform-gpu items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/75 px-8 font-semibold text-slate-700 backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-150 will-change-transform hover:border-teal-500/50 hover:bg-teal-50 hover:text-teal-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-700/50 dark:hover:text-white"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Projects
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.a>
                    </motion.div>

                    <motion.div variants={fadeUp} className="mt-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-800 sm:hidden" />
                        <div className="flex flex-wrap gap-3">
                            {socials.map(({ label, href, icon: Icon, title }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                                    rel="noreferrer"
                                    aria-label={label}
                                    onMouseEnter={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        showTooltip(title, { x: rect.left + rect.width / 2, y: rect.bottom });
                                    }}
                                    onMouseLeave={hideTooltip}
                                    className="inline-flex h-12 w-12 transform-gpu items-center justify-center rounded-xl border border-slate-300 bg-white/70 text-slate-600 backdrop-blur-sm transition-[background-color,border-color,box-shadow,color,transform] duration-150 will-change-transform hover:border-teal-500/50 hover:bg-teal-50 hover:text-teal-700 hover:shadow-[0_0_15px_rgba(20,184,166,0.18)] dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-teal-500/10 dark:hover:text-teal-300 dark:hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column / Premium Developer Cockpit Redesign */}
                <motion.div
                    className="relative hidden lg:flex h-[550px] items-center justify-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {/* Background Atmospheric Glow */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <motion.div
                            className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px]"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        
                        {/* Decorative Grid Mesh */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.035)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-70" />
                    </div>

                    {/* Main Workspace Frame */}
                    <div className="relative z-10 w-full max-w-md">
                        
                        {/* 1. IDE Code Window */}
                        <motion.div 
                            className="relative w-full rounded-2xl border border-slate-200 bg-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#090d16]/75 dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                            whileHover={{ y: -4, rotateY: -2, rotateX: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/40">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <FileCode className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                                    server.ts
                                </span>
                                <div className="w-12" /> {/* Spacer */}
                            </div>

                            {/* Code Editor Body */}
                            <div className="p-6 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 overflow-x-auto select-none">
                                {codeLines.map((line) => (
                                    <div key={line.line} className="flex gap-4">
                                        <span className="text-slate-300 w-4 select-none text-right font-light dark:text-slate-700">{line.line}</span>
                                        <span className={`${line.hasIndent ? 'pl-4' : ''}`}>
                                            {line.content}
                                            {line.extra}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* 2. Terminal Overlay Window */}
                        <motion.div 
                            className="absolute -bottom-10 -right-8 w-[320px] rounded-xl border border-slate-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#070a10]/90 dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-20"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            whileHover={{ y: -3 }}
                        >
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 rounded-t-xl">
                                <div className="flex items-center gap-1.5">
                                    <Terminal className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">terminal</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active</span>
                                </div>
                            </div>

                            {/* Terminal Logs */}
                            <div className="p-4 font-mono text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-1.5 select-none">
                                {terminalLogs.map((log, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        {index === 0 ? (
                                            <span className="text-teal-500 dark:text-teal-400">$</span>
                                        ) : null}
                                        <span className={log.color}>{log.text}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-1">
                                    <span className="text-teal-500 dark:text-teal-400">$</span>
                                    <motion.span 
                                        className="h-3.5 w-1.5 bg-teal-400 dark:bg-teal-300"
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: 'steps(2)' }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Floating Technology Badges (Orbiting Stack Badges) */}
                        {stackBadges.map((badge) => {
                            const Icon = badge.icon;
                            return (
                                <motion.div
                                    key={badge.name}
                                    className={`absolute z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md cursor-default transition-all duration-300 shadow-sm ${badge.color} ${badge.position}`}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: badge.duration,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: badge.delay,
                                    }}
                                    whileHover={{ scale: 1.08, y: -5 }}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-[10px] font-bold tracking-wider uppercase">{badge.name}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
