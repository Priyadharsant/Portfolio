import type { Ref } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Code2, Download, Github, Linkedin, Mail, ArrowRight, Sparkles, Cloud, Layout, Server } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { fadeUp, staggerContainer } from '../utils/motion';

type HeroProps = {
    profile: PortfolioData['profile'];
    hero: PortfolioData['hero'];
    nameRef?: Ref<HTMLHeadingElement>;

};

const particles = [
    { top: '20%', left: '10%', delay: 0, duration: 8 },
    { top: '30%', left: '40%', delay: 2, duration: 6 },
    { top: '15%', left: '70%', delay: 1, duration: 7 },
    { top: '60%', left: '20%', delay: 3, duration: 9 },
    { top: '80%', left: '60%', delay: 4, duration: 6 },
    { top: '50%', left: '80%', delay: 0.5, duration: 8 },
    { top: '70%', left: '90%', delay: 2.5, duration: 7 },
    { top: '90%', left: '30%', delay: 1.5, duration: 8 },
    { top: '40%', left: '50%', delay: 3.5, duration: 6 },
    { top: '85%', left: '15%', delay: 2, duration: 7 },
];

const Hero = ({ profile, hero, nameRef }: HeroProps) => {
    const socials = [
        { label: 'GitHub', href: profile.github, icon: Github },
        { label: 'LinkedIn', href: profile.linkedin, icon: Linkedin },
        { label: 'CodeChef', href: profile.codechef, icon: ChefHat },
        { label: 'LeetCode', href: profile.leetcode, icon: Code2 },
        { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
    ];

    const getHighlightIcon = (title: string) => {
        if (title.includes('AWS') || title.includes('Cloud')) return Cloud;
        if (title.includes('Front') || title.includes('UI')) return Layout;
        return Server;
    };

    return (
        <section className="relative min-h-screen overflow-hidden border-b border-slate-200/80 bg-[#f8fbff] dark:border-white/5 dark:bg-[#06070b]">
            {/* --- ANIMATED BACKGROUND START --- */}
            <motion.div
                className="absolute -left-[10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-teal-400/20 blur-[120px] pointer-events-none dark:bg-teal-500/10"
                animate={{ x: [0, 50, 0, -50, 0], y: [0, 30, 60, 30, 0], scale: [1, 1.1, 1, 0.9, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute -right-[10%] bottom-[-10%] h-[40rem] w-[40rem] rounded-full bg-sky-400/20 blur-[120px] pointer-events-none dark:bg-cyan-500/10"
                animate={{ x: [0, -50, 0, 50, 0], y: [0, -30, -60, -30, 0], scale: [1, 0.9, 1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
                animate={{ backgroundPosition: ['0px 0px', '64px 64px'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-teal-400/90 shadow-[0_0_12px_rgba(20,184,166,0.35)]"
                        style={{ top: particle.top, left: particle.left }}
                        animate={{ y: [0, -80], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
                    />
                ))}
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
                            href="/download_resume"
                            className="inline-flex h-12 transform-gpu items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 font-semibold text-white transition-[box-shadow,transform] duration-150 will-change-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(20,184,166,0.32)] focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] dark:from-teal-400 dark:to-cyan-500 dark:text-slate-950 dark:hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] dark:focus:ring-teal-400 dark:focus:ring-offset-[#06070b]"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Download className="h-5 w-5" />
                            Download Resume
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
                            {socials.map(({ label, href, icon: Icon }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                                    rel="noreferrer"
                                    aria-label={label}
                                    title={label}
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

                {/* Right Column / Highlights Grid Redesign */}
                <motion.div
                    className="relative hidden lg:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <div className="relative mx-auto w-full max-w-lg">
                        {/* Decorative core glow */}
                        <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/20 blur-[50px] dark:bg-teal-500/10" />

                        <div className="grid grid-cols-2 gap-4">
                            {hero.highlights.map((highlight, index) => {
                                const Icon = getHighlightIcon(highlight);
                                const isFullWidth = index === hero.highlights.length - 1 && hero.highlights.length % 2 !== 0;

                                return (
                                    <motion.div
                                        key={highlight}
                                        className={`group relative transform-gpu overflow-hidden rounded-2xl border border-slate-200 bg-white/75 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-150 will-change-transform hover:border-teal-500/40 hover:bg-white hover:shadow-[0_8px_22px_rgba(20,184,166,0.16)] dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none dark:hover:bg-slate-800/80 dark:hover:shadow-[0_8px_15px_rgba(45,212,191,0.15)] ${isFullWidth ? 'col-span-2' : 'col-span-1'}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 + index * 0.15, type: 'spring', stiffness: 50 }}
                                        whileHover={{ y: -5, transition: { duration: 0.16, ease: 'easeOut', delay: 0 } }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-4 inline-flex h-12 w-12 transform-gpu items-center justify-center rounded-xl bg-slate-100/90 border border-slate-200 text-teal-700 transition-[background-color,border-color,transform] duration-150 will-change-transform group-hover:scale-110 group-hover:bg-teal-100 group-hover:border-teal-500/30 dark:bg-slate-800/80 dark:border-slate-700 dark:text-teal-400 dark:group-hover:bg-teal-500/20">
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100 mb-2">
                                                {highlight}
                                            </h3>

                                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mt-auto">
                                                {highlight === 'AWS Cloud'
                                                    ? 'Cloud automation & scalable deploy-ready architecture'
                                                    : highlight === 'Frontend'
                                                        ? 'Clean UI, motion & responsive web experiences'
                                                        : 'APIs, microservices, and robust backend logic'}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Decorative element to fill space if needed or just add flair */}
                            {hero.highlights.length % 2 === 0 && (
                                <motion.div
                                    className="col-span-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center p-6 opacity-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 1 }}
                                >
                                    <Sparkles className="h-6 w-6 text-slate-400 dark:text-slate-600 animate-pulse" />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
