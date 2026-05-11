import { motion } from 'framer-motion';
import {
    Binary,
    Braces,
    Cloud,
    Code2,
    Cpu,
    Database,
    GitBranch,
    Network,
    Server,
    ShieldCheck,
    Terminal,
    Workflow,
} from 'lucide-react';

const icons = [Terminal, Code2, Braces, Server, GitBranch, Cloud, Database, Cpu, Network, Workflow, Binary, ShieldCheck];

const options = [
    'Terminal Rain',
    'Route Tracer',
    'IDE Split',
    'Cloud Nodes',
    'Git Timeline',
    'API Blueprint',
    'Block Wave',
    'Server Rack',
    'Data Orbit',
    'Deploy Flow',
    'Security Shield',
    'Binary Stream',
    'Scan Line',
    'Command Prompt',
    'Floating Chips',
    'Diagonal Bands',
    'Core Squares',
    'Mesh Lines',
    'Card Stack',
    'Pipeline Steps',
    'Database Pulse',
    'Cursor Blink',
    'Code Brackets',
    'Signal Pulse',
    'Cloud Bubbles',
    'Diamond Grid',
    'Editor Tabs',
    'Endpoint List',
    'Deploy Stairs',
    'Minimal Dots',
    'Split Console',
    'Code Waterfall',
    'Service Radar',
    'Floating Windows',
    'Layered Terminal',
    'Module Rings',
    'Async Queue',
    'Build Scanner',
    'Port Monitor',
    'Cloud Layers',
    'Stacked APIs',
    'Syntax Curtain',
    'Grid Scanner',
    'Logic Gates',
    'Data Columns',
    'Route Compass',
    'Package Tiles',
    'Release Waves',
    'Memory Blocks',
    'Hero Console',
];

const snippets = [
    ['npm run dev', 'server.listen(5000)', 'status: 200'],
    ['const api = express()', 'GET /portfolio', 'POST /contact'],
    ['git push origin main', 'build passed', 'deploy ready'],
    ['type Skill = "AWS"', 'React + Node', 'ship()'],
];

const backendSystems = [
    {
        title: 'API Gateway',
        primary: 'GET /api/portfolio',
        secondary: 'Express -> Controller -> JSON',
        metric: '42ms',
        nodes: ['Client', 'API', 'DB'],
    },
    {
        title: 'Mail Service',
        primary: 'POST /api/contact',
        secondary: 'Validate -> NodeMailer -> Auto Reply',
        metric: 'SMTP',
        nodes: ['Form', 'Mail', 'Inbox'],
    },
    {
        title: 'Auth Layer',
        primary: 'JWT Middleware',
        secondary: 'Token -> Role -> Protected Route',
        metric: 'Secure',
        nodes: ['User', 'JWT', 'Route'],
    },
    {
        title: 'Cloud Deploy',
        primary: 'Build -> Deploy',
        secondary: 'Frontend + Backend + AWS Ready',
        metric: 'Live',
        nodes: ['Vite', 'Node', 'AWS'],
    },
    {
        title: 'Database Flow',
        primary: 'MongoDB / MySQL',
        secondary: 'Schema -> Query -> Response',
        metric: 'Indexed',
        nodes: ['Model', 'Query', 'Data'],
    },
];

const iconStyles = [
    'rounded-md border border-teal-300/25 bg-teal-300/10 text-teal-200',
    'rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
    'rounded-xl border border-blue-300/25 bg-blue-300/10 text-blue-200',
    'rounded-md border border-emerald-300/25 bg-emerald-300/10 text-emerald-200 rotate-3',
    'rounded-full border border-white/15 bg-white/10 text-white',
];

const baseCard = 'relative h-[calc(100svh-7rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[#06070b] p-6 shadow-2xl shadow-black/30';

const renderBackendPanel = (index: number) => {
    const system = backendSystems[index % backendSystems.length];

    return (
        <motion.div
            className="w-full max-w-2xl rounded-lg border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/30 backdrop-blur-md"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.45 }}
        >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">{system.title}</p>
                    <h3 className="mt-2 font-mono text-lg font-bold text-white">{system.primary}</h3>
                </div>
                <motion.span
                    className="rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-1 font-mono text-sm font-bold text-teal-200"
                    animate={{ opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                >
                    {system.metric}
                </motion.span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 font-mono text-xs">
                    <p className="text-slate-500">// backend execution</p>
                    <motion.p className="mt-2 text-teal-200" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.6, repeat: Infinity }}>
                        {system.secondary}
                    </motion.p>
                    <p className="mt-4 text-cyan-200">return response.status(200)</p>
                    <p className="mt-1 text-slate-500">{'}'}</p>
                </div>
                <div className="relative min-h-32 rounded-md border border-white/10 bg-white/[0.025] p-4">
                    <div className="absolute left-8 right-8 top-1/2 h-px bg-teal-200/25" />
                    <div className="relative flex h-full items-center justify-between">
                        {system.nodes.map((node, nodeIndex) => (
                            <motion.div
                                key={node}
                                className="flex h-16 w-16 items-center justify-center rounded-md border border-white/10 bg-[#08111a] text-center text-[11px] font-bold text-slate-200"
                                animate={{ y: [0, nodeIndex % 2 === 0 ? -5 : 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: nodeIndex * 0.22 }}
                            >
                                {node}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {['Logs', 'Latency', 'Uptime'].map((item, metricIndex) => (
                    <motion.div
                        key={item}
                        className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2"
                        animate={{ borderColor: ['rgba(255,255,255,.1)', 'rgba(94,234,212,.3)', 'rgba(255,255,255,.1)'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: metricIndex * 0.25 }}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{item}</p>
                        <p className="mt-1 font-mono text-sm font-bold text-white">{metricIndex === 0 ? 'clean' : metricIndex === 1 ? system.metric : '99.9%'}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const renderPattern = (index: number) => {
    switch (index) {
        case 0:
            return Array.from({ length: 7 }).map((_, item) => (
                <motion.div key={item} className="absolute top-0 h-20 w-px bg-gradient-to-b from-teal-300/0 via-teal-300/55 to-teal-300/0" style={{ left: `${10 + item * 13}%` }} animate={{ y: ['-40%', '240%'] }} transition={{ duration: 3.4 + item * 0.25, repeat: Infinity, ease: 'linear', delay: item * 0.2 }} />
            ));
        case 1:
            return <svg className="absolute inset-0 h-full w-full opacity-55" viewBox="0 0 420 260"><path d="M30 70 H130 Q170 70 170 110 V160 H390" fill="none" stroke="rgba(45,212,191,.45)" /><motion.circle r="4" fill="#99f6e4" animate={{ cx: [30, 130, 170, 170, 390], cy: [70, 70, 110, 160, 160] }} transition={{ duration: 5, repeat: Infinity }} /></svg>;
        case 2:
            return <div className="absolute inset-5 grid grid-cols-[0.55fr_1fr] gap-3"><motion.div className="rounded-md border border-white/10 bg-white/[0.04]" animate={{ opacity: [0.35, 0.75, 0.35] }} transition={{ duration: 3, repeat: Infinity }} /><div className="space-y-3">{[0, 1, 2].map((item) => <motion.div key={item} className="h-12 rounded-md border border-white/10 bg-white/[0.035]" animate={{ x: [0, item % 2 ? -5 : 5, 0] }} transition={{ duration: 4 + item, repeat: Infinity }} />)}</div></div>;
        case 3:
            return <>{[[20, 30], [72, 24], [58, 72], [34, 64]].map(([left, top], item) => <motion.span key={item} className="absolute h-4 w-4 rounded-full border border-cyan-200/35 bg-cyan-200/10" style={{ left: `${left}%`, top: `${top}%` }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: item * 0.3 }} />)}<motion.div className="absolute left-[22%] top-[34%] h-px w-1/2 bg-cyan-200/25" animate={{ scaleX: [0.35, 1, 0.35] }} transition={{ duration: 4, repeat: Infinity }} /></>;
        case 4:
            return <><div className="absolute left-12 top-8 h-[75%] w-px bg-white/20" />{[0, 1, 2, 3, 4].map((item) => <motion.span key={item} className="absolute left-[42px] h-3 w-3 rounded-full border border-teal-200/55 bg-[#06070b]" style={{ top: `${16 + item * 14}%` }} animate={{ boxShadow: ['0 0 0 rgba(94,234,212,0)', '0 0 18px rgba(94,234,212,.65)', '0 0 0 rgba(94,234,212,0)'] }} transition={{ duration: 2.8, repeat: Infinity, delay: item * 0.24 }} />)}</>;
        case 5:
            return <><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] bg-[length:38px_38px]" /><motion.div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-teal-200/25" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} /></>;
        case 6:
            return <div className="absolute inset-5 grid grid-cols-5 gap-2">{Array.from({ length: 20 }).map((_, item) => <motion.span key={item} className="rounded border border-white/10 bg-white/[0.04]" animate={{ opacity: [0.18, 0.75, 0.18], y: [0, item % 2 ? 5 : -5, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: item * 0.04 }} />)}</div>;
        case 7:
            return <div className="absolute inset-x-7 top-8 space-y-3">{[0, 1, 2, 3, 4].map((item) => <motion.div key={item} className="h-8 rounded-md border border-white/10 bg-black/25" animate={{ x: [0, item % 2 ? -5 : 5, 0] }} transition={{ duration: 4 + item * 0.2, repeat: Infinity }} />)}</div>;
        case 8:
            return <><motion.div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-200/25" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} /><motion.div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20" animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} /></>;
        case 9:
            return <div className="absolute inset-6 flex items-center justify-between">{[0, 1, 2, 3].map((item) => <motion.div key={item} className="h-12 w-16 rounded-md border border-white/10 bg-white/[0.05]" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: item * 0.25 }} />)}<div className="absolute left-12 right-12 top-1/2 h-px bg-teal-200/25" /></div>;
        case 10:
            return <><motion.div className="absolute left-1/2 top-10 h-36 w-28 -translate-x-1/2 rounded-t-full border border-blue-200/30" animate={{ opacity: [0.25, 0.8, 0.25] }} transition={{ duration: 3, repeat: Infinity }} /><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,.16),transparent_24%)]" /></>;
        case 11:
            return <div className="absolute inset-4 grid grid-cols-6 gap-1 font-mono text-[10px] text-teal-200/40">{Array.from({ length: 72 }).map((_, item) => <motion.span key={item} animate={{ opacity: [0.15, 0.75, 0.15] }} transition={{ duration: 2, repeat: Infinity, delay: (item % 12) * 0.08 }}>{item % 3 ? '1' : '0'}</motion.span>)}</div>;
        case 12:
            return <motion.div className="absolute inset-x-0 top-1/2 h-12 bg-gradient-to-b from-transparent via-teal-200/15 to-transparent" animate={{ y: ['-180%', '180%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />;
        case 13:
            return <div className="absolute left-8 top-8 w-72 rounded-md border border-white/10 bg-black/30 p-4 font-mono text-xs text-teal-200/80"><p>$ npm run dev</p><motion.p animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>▌</motion.p></div>;
        case 14:
            return <div className="absolute inset-5 flex flex-wrap content-start gap-2">{['React', 'Node', 'AWS', 'REST', 'DSA', 'Git'].map((item, chip) => <motion.span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: chip * 0.18 }}>{item}</motion.span>)}</div>;
        case 15:
            return <>{[0, 1, 2, 3].map((item) => <motion.div key={item} className="absolute h-12 w-[140%] -rotate-12 bg-white/[0.035]" style={{ top: `${15 + item * 18}%`, left: '-20%' }} animate={{ x: ['-8%', '8%', '-8%'] }} transition={{ duration: 5 + item, repeat: Infinity }} />)}</>;
        case 16:
            return <div className="absolute inset-0 flex items-center justify-center">{[0, 1, 2].map((item) => <motion.div key={item} className="absolute rounded-lg border border-teal-200/20" style={{ width: 80 + item * 50, height: 80 + item * 50 }} animate={{ rotate: item % 2 ? -360 : 360 }} transition={{ duration: 16 + item * 4, repeat: Infinity, ease: 'linear' }} />)}</div>;
        case 17:
            return <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 400 260">{Array.from({ length: 7 }).map((_, item) => <motion.path key={item} d={`M${20 + item * 45} 30 C ${80 + item * 10} 100, ${160 - item * 8} 150, ${380 - item * 20} 230`} stroke="rgba(94,234,212,.35)" fill="none" animate={{ pathLength: [0.25, 1, 0.25] }} transition={{ duration: 4 + item * 0.25, repeat: Infinity }} />)}</svg>;
        case 18:
            return <div className="absolute inset-6">{[0, 1, 2].map((item) => <motion.div key={item} className="absolute h-28 w-44 rounded-md border border-white/10 bg-white/[0.04]" style={{ left: item * 28, top: item * 20 }} animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: item * 0.25 }} />)}</div>;
        case 19:
            return <div className="absolute bottom-14 left-8 right-8 flex items-end gap-3">{[0, 1, 2, 3, 4].map((item) => <motion.div key={item} className="flex-1 rounded-t-md border border-white/10 bg-white/[0.05]" style={{ height: 34 + item * 12 }} animate={{ opacity: [0.35, 0.8, 0.35] }} transition={{ duration: 2.5, repeat: Infinity, delay: item * 0.18 }} />)}</div>;
        case 20:
            return <div className="absolute inset-0 flex items-center justify-center">{[0, 1, 2].map((item) => <motion.div key={item} className="absolute h-20 w-36 rounded-[50%] border border-teal-200/25" style={{ transform: `translateY(${item * 22}px)` }} animate={{ scaleX: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, delay: item * 0.3 }} />)}</div>;
        case 21:
            return <div className="absolute left-8 top-10 font-mono text-6xl font-black text-white/10"><motion.span animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1.1, repeat: Infinity }}>_</motion.span></div>;
        case 22:
            return <div className="absolute inset-0 flex items-center justify-between px-8 text-8xl font-black text-teal-200/10"><motion.span animate={{ x: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>{'{'}</motion.span><motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}>{'}'}</motion.span></div>;
        case 23:
            return <>{[0, 1, 2].map((item) => <motion.span key={item} className="absolute rounded-full border border-teal-200/25" style={{ left: `${35 + item * 8}%`, top: `${35 + item * 8}%`, width: 38 + item * 44, height: 38 + item * 44 }} animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.15, 0.55, 0.15] }} transition={{ duration: 3.5, repeat: Infinity, delay: item * 0.5 }} />)}</>;
        case 24:
            return <>{[0, 1, 2, 3].map((item) => <motion.div key={item} className="absolute rounded-full border border-white/10 bg-white/[0.04]" style={{ left: `${16 + item * 17}%`, top: `${25 + (item % 2) * 24}%`, width: 42 + item * 8, height: 42 + item * 8 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4 + item * 0.3, repeat: Infinity }} />)}</>;
        case 25:
            return <div className="absolute inset-6 grid grid-cols-5 gap-3">{Array.from({ length: 15 }).map((_, item) => <motion.div key={item} className="rotate-45 border border-white/10 bg-white/[0.035]" animate={{ opacity: [0.2, 0.75, 0.2] }} transition={{ duration: 2.4, repeat: Infinity, delay: item * 0.05 }} />)}</div>;
        case 26:
            return <div className="absolute left-8 right-8 top-8 space-y-2">{[0, 1, 2, 3].map((item) => <motion.div key={item} className="h-9 rounded-t-md border border-white/10 bg-white/[0.04]" animate={{ width: [`${55 + item * 8}%`, `${70 + item * 5}%`, `${55 + item * 8}%`] }} transition={{ duration: 3.6, repeat: Infinity, delay: item * 0.2 }} />)}</div>;
        case 27:
            return <div className="absolute inset-x-7 top-8 space-y-3">{['GET /api', 'POST /mail', 'PUT /data', '200 OK'].map((item, row) => <motion.div key={item} className="flex items-center justify-between rounded-md border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-slate-300" animate={{ x: [0, row % 2 ? -5 : 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: row * 0.2 }}><span>{item}</span><span className="h-2 w-2 rounded-full bg-teal-300" /></motion.div>)}</div>;
        case 28:
            return <div className="absolute bottom-12 left-8 right-8 flex items-end gap-2">{[0, 1, 2, 3, 4, 5].map((item) => <motion.div key={item} className="flex-1 rounded-md border border-white/10 bg-white/[0.04]" style={{ height: 24 + item * 9 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: item * 0.12 }} />)}</div>;
        case 29:
            return <div className="absolute inset-0">{Array.from({ length: 28 }).map((_, item) => <motion.span key={item} className="absolute h-1.5 w-1.5 rounded-full bg-teal-200/35" style={{ left: `${8 + (item * 17) % 84}%`, top: `${12 + (item * 23) % 72}%` }} animate={{ opacity: [0.2, 0.85, 0.2] }} transition={{ duration: 2.2, repeat: Infinity, delay: item * 0.04 }} />)}</div>;
        case 30:
            return <div className="absolute inset-6 grid grid-cols-2 gap-4">{[0, 1, 2, 3].map((item) => <motion.div key={item} className="rounded-md border border-white/10 bg-black/25" animate={{ y: [0, item % 2 ? 8 : -8, 0] }} transition={{ duration: 4 + item * 0.2, repeat: Infinity }} />)}</div>;
        case 31:
            return <div className="absolute inset-0 font-mono text-xs text-teal-200/35">{Array.from({ length: 12 }).map((_, item) => <motion.div key={item} className="absolute whitespace-nowrap" style={{ left: `${8 + item * 7}%` }} animate={{ y: ['-20%', '125%'] }} transition={{ duration: 4 + item * 0.18, repeat: Infinity, ease: 'linear' }}>{'const x = await api();'}</motion.div>)}</div>;
        case 32:
            return <div className="absolute inset-0 flex items-center justify-center">{[0, 1, 2, 3].map((item) => <motion.div key={item} className="absolute rounded-full border border-cyan-200/20" style={{ width: 80 + item * 70, height: 80 + item * 70 }} animate={{ scale: [0.92, 1.05, 0.92], opacity: [0.18, 0.55, 0.18] }} transition={{ duration: 3.8, repeat: Infinity, delay: item * 0.35 }} />)}<motion.span className="absolute h-3 w-3 rounded-full bg-teal-200" animate={{ rotate: 360, x: [0, 120, 0, -120, 0], y: [-120, 0, 120, 0, -120] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} /></div>;
        case 33:
            return <div className="absolute inset-6">{[0, 1, 2, 3, 4].map((item) => <motion.div key={item} className="absolute rounded-md border border-white/10 bg-white/[0.04]" style={{ width: 160 - item * 14, height: 90 - item * 6, left: 30 + item * 62, top: 28 + item * 32 }} animate={{ y: [0, -6, 0], opacity: [0.35, 0.75, 0.35] }} transition={{ duration: 4, repeat: Infinity, delay: item * 0.18 }} />)}</div>;
        case 34:
            return <div className="absolute inset-x-8 top-10 space-y-4">{[0, 1, 2].map((item) => <motion.div key={item} className="rounded-md border border-white/10 bg-black/30 p-3 font-mono text-xs text-slate-300" animate={{ x: [0, item % 2 ? -8 : 8, 0] }} transition={{ duration: 5, repeat: Infinity, delay: item * 0.25 }}><span className="text-teal-200">$</span> node server-{item}.js</motion.div>)}</div>;
        case 35:
            return <div className="absolute inset-0 flex items-center justify-center">{[0, 1, 2, 3].map((item) => <motion.div key={item} className="absolute rounded-full border border-teal-200/20" style={{ width: 100 + item * 42, height: 52 + item * 24 }} animate={{ rotate: item % 2 ? -360 : 360 }} transition={{ duration: 14 + item * 3, repeat: Infinity, ease: 'linear' }} />)}</div>;
        case 36:
            return <div className="absolute bottom-12 left-8 right-8 flex items-end gap-2">{Array.from({ length: 10 }).map((_, item) => <motion.div key={item} className="flex-1 rounded-md border border-white/10 bg-white/[0.04]" style={{ height: 30 + (item % 5) * 18 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: item * 0.08 }} />)}</div>;
        case 37:
            return <motion.div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-transparent via-teal-200/15 to-transparent" animate={{ x: ['-120%', '520%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }} />;
        case 38:
            return <div className="absolute inset-8 grid grid-cols-3 gap-4">{['5173', '5000', '443', '22', '8080', '27017'].map((port, item) => <motion.div key={port} className="rounded-md border border-white/10 bg-black/25 p-4 font-mono text-sm text-teal-200" animate={{ borderColor: ['rgba(255,255,255,.1)', 'rgba(94,234,212,.45)', 'rgba(255,255,255,.1)'] }} transition={{ duration: 2.4, repeat: Infinity, delay: item * 0.18 }}>{port}</motion.div>)}</div>;
        case 39:
            return <div className="absolute inset-0">{[0, 1, 2, 3].map((item) => <motion.div key={item} className="absolute left-1/2 top-1/2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.025]" style={{ width: 90 + item * 70, height: 90 + item * 70, marginLeft: -(45 + item * 35), marginTop: -(45 + item * 35) }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: item * 0.2 }} />)}</div>;
        case 40:
            return <div className="absolute inset-x-8 top-8 space-y-3">{['/api/portfolio', '/api/contact', '/api/health', '/api/projects'].map((api, item) => <motion.div key={api} className="flex justify-between rounded-md border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs text-slate-300" animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: item * 0.25 }}><span>{api}</span><span className="text-teal-200">200</span></motion.div>)}</div>;
        case 41:
            return <>{[0, 1, 2, 3, 4].map((item) => <motion.div key={item} className="absolute h-full w-12 bg-white/[0.035]" style={{ left: `${item * 22}%` }} animate={{ scaleY: [0.85, 1, 0.85] }} transition={{ duration: 3 + item * 0.4, repeat: Infinity }} />)}</>;
        case 42:
            return <motion.div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_30%,rgba(94,234,212,.12)_30%_31%,transparent_31%_100%)] bg-[length:56px_56px]" animate={{ backgroundPosition: ['0px 0px', '112px 0px'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />;
        case 43:
            return <svg className="absolute inset-0 h-full w-full opacity-55" viewBox="0 0 420 260">{[0, 1, 2, 3].map((item) => <motion.path key={item} d={`M40 ${50 + item * 40} H150 L205 ${30 + item * 45} H350`} stroke="rgba(94,234,212,.35)" fill="none" animate={{ pathLength: [0.2, 1, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: item * 0.25 }} />)}</svg>;
        case 44:
            return <div className="absolute inset-8 grid grid-cols-4 gap-3">{Array.from({ length: 16 }).map((_, item) => <motion.div key={item} className="rounded-md border border-white/10 bg-white/[0.04]" animate={{ height: [28, 58, 28] }} transition={{ duration: 3, repeat: Infinity, delay: item * 0.06 }} />)}</div>;
        case 45:
            return <div className="absolute inset-0 flex items-center justify-center"><motion.div className="h-52 w-52 rounded-full border border-teal-200/20" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} /><motion.div className="absolute h-px w-72 bg-teal-200/20" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} /></div>;
        case 46:
            return <div className="absolute inset-5 grid grid-cols-4 gap-2">{['react', 'vite', 'node', 'aws', 'api', 'git', 'dsa', 'rest'].map((pkg, item) => <motion.div key={pkg} className="rounded-md border border-white/10 bg-black/25 p-2 font-mono text-xs text-slate-300" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: item * 0.1 }}>{pkg}</motion.div>)}</div>;
        case 47:
            return <>{[0, 1, 2].map((item) => <motion.div key={item} className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-teal-200/10 to-transparent" animate={{ y: [40 + item * 20, -10, 40 + item * 20] }} transition={{ duration: 5 + item, repeat: Infinity }} />)}</>;
        case 48:
            return <div className="absolute inset-6 grid grid-cols-8 gap-2">{Array.from({ length: 48 }).map((_, item) => <motion.div key={item} className="rounded-sm bg-white/[0.04]" animate={{ opacity: [0.15, 0.65, 0.15] }} transition={{ duration: 2.5, repeat: Infinity, delay: item * 0.025 }} />)}</div>;
        default:
            return <div className="absolute inset-x-8 top-8 rounded-lg border border-white/10 bg-black/30 p-5 font-mono text-sm text-slate-300"><motion.p animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 2, repeat: Infinity }}>portfolio.hero.render()</motion.p><p className="mt-3 text-teal-200">background: selected</p><p className="text-cyan-200">animation: smooth</p></div>;
    }
};

const BackgroundDemo = () => {
    return (
        <main className="h-screen snap-y snap-mandatory overflow-y-auto bg-[#06070b] text-slate-100">
            <div className="fixed left-5 top-4 z-50 sm:left-8">
                <a href="/" className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm font-semibold text-teal-300 backdrop-blur hover:text-teal-200">
                    Back to portfolio
                </a>
            </div>
            <div>
                    {options.map((name, index) => {
                        const Icon = icons[index % icons.length];
                        const sample = snippets[index % snippets.length];
                        const iconClass = iconStyles[index % iconStyles.length];

                        return (
                            <section key={name} className="flex min-h-screen snap-start items-center justify-center px-4 py-14 sm:px-8">
                                <motion.div
                                    className={baseCard}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.45 }}
                                    transition={{ duration: 0.45 }}
                                >
                                    {renderPattern(index)}
                                    <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="relative flex h-full flex-col justify-between">
                                    <div className="flex items-start justify-between gap-5">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
                                                Option {String(index + 1).padStart(2, '0')} / 50
                                            </p>
                                            <h2 className="mt-3 text-4xl font-black text-white sm:text-6xl">{name}</h2>
                                        </div>
                                        <motion.div
                                            className={`flex h-14 w-14 flex-none items-center justify-center shadow-sm shadow-black/30 backdrop-blur sm:h-16 sm:w-16 ${iconClass}`}
                                            animate={{ y: [0, -3, 0], rotate: index % 4 === 0 ? [0, 2, 0] : 0 }}
                                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            <Icon className="h-7 w-7" />
                                        </motion.div>
                                    </div>
                                    <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
                                        {renderBackendPanel(index)}
                                        <div className="hidden rounded-lg border border-white/10 bg-black/35 p-4 font-mono text-xs backdrop-blur lg:block">
                                            <div className="mb-4 flex gap-1.5">
                                                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                                            </div>
                                            {sample.map((line, lineIndex) => (
                                                <motion.p
                                                    key={line}
                                                    className={lineIndex === 0 ? 'text-slate-500' : lineIndex === 1 ? 'text-teal-200' : 'text-cyan-200'}
                                                    animate={{ opacity: [0.55, 1, 0.55] }}
                                                    transition={{ duration: 3, delay: lineIndex * 0.35, repeat: Infinity }}
                                                >
                                                    {line}
                                                </motion.p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                </motion.div>
                            </section>
                        );
                    })}
            </div>
        </main>
    );
};

export default BackgroundDemo;
