import { motion } from 'framer-motion';
import { ChefHat, Code2, Download, Github, Linkedin, Mail, ArrowRight, Sparkles, Cloud, Layout, Server } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { fadeUp, staggerContainer } from '../utils/motion';

type HeroProps = {
    profile: PortfolioData['profile'];
    hero: PortfolioData['hero'];
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

const Hero = ({ profile, hero }: HeroProps) => {
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
        <section className="relative min-h-screen overflow-hidden border-b border-white/5 bg-[#06070b]">
            {/* --- ANIMATED BACKGROUND START --- */}
            <motion.div
                className="absolute -left-[10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"
                animate={{ x: [0, 50, 0, -50, 0], y: [0, 30, 60, 30, 0], scale: [1, 1.1, 1, 0.9, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute -right-[10%] bottom-[-10%] h-[40rem] w-[40rem] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"
                animate={{ x: [0, -50, 0, 50, 0], y: [0, -30, -60, -30, 0], scale: [1, 0.9, 1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
                animate={{ backgroundPosition: ['0px 0px', '64px 64px'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-teal-300/40"
                        style={{ top: particle.top, left: particle.left }}
                        animate={{ y: [0, -80], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
                    />
                ))}
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
                    <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300 backdrop-blur-sm shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                        <Sparkles className="h-4 w-4" />
                        {hero.kicker}
                    </motion.div>
                    
                    <motion.h1 variants={fadeUp} className="text-5xl font-black leading-tight tracking-tight text-slate-100 sm:text-7xl">
                        {profile.name}
                    </motion.h1>
                    
                    <motion.h2 variants={fadeUp} className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500 sm:text-3xl">
                        {profile.title}
                    </motion.h2>
                    
                    <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl max-w-xl">
                        {profile.tagline}
                    </motion.p>
                    
                    <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <motion.a
                            href={profile.resume}
                            download
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 px-8 font-semibold text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#06070b]"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Download className="h-5 w-5" />
                            Download Resume
                        </motion.a>
                        <motion.a
                            href="#projects"
                            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-8 font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-teal-500/50 hover:bg-slate-700/50 hover:text-white"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Projects
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.a>
                    </motion.div>
                    
                    <motion.div variants={fadeUp} className="mt-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent sm:hidden" />
                        <div className="flex flex-wrap gap-3">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                                    rel="noreferrer"
                                    aria-label={label}
                                    title={label}
                                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 backdrop-blur-sm transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-300 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]"
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
                        <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            {hero.highlights.map((highlight, index) => {
                                const Icon = getHighlightIcon(highlight);
                                const isFullWidth = index === hero.highlights.length - 1 && hero.highlights.length % 2 !== 0;
                                
                                return (
                                    <motion.div
                                        key={highlight}
                                        className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-all hover:border-teal-500/40 hover:bg-slate-800/80 hover:shadow-[0_8px_30px_rgba(45,212,191,0.15)] ${isFullWidth ? 'col-span-2' : 'col-span-1'}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 + index * 0.15, type: 'spring', stiffness: 50 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700 text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-all duration-300">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-slate-100 mb-2">
                                                {highlight}
                                            </h3>
                                            
                                            <p className="text-sm leading-relaxed text-slate-400 mt-auto">
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
                                    className="col-span-2 rounded-2xl border border-dashed border-slate-800 flex items-center justify-center p-6 opacity-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 1 }}
                                >
                                     <Sparkles className="h-6 w-6 text-slate-600 animate-pulse" />
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