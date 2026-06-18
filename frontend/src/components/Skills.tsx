import { motion } from 'framer-motion';
import { Code2, Database, MonitorSmartphone, Wrench, Sparkles, Server, Terminal, Cloud } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { fadeUp, staggerContainer } from '../utils/motion';

type SkillsProps = {
    skills: PortfolioData['skills'];
    intro: PortfolioData['skillsIntro'];
};

const getCategoryIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('frontend') || t.includes('ui')) return MonitorSmartphone;
    if (t.includes('backend') || t.includes('server')) return Server;
    if (t.includes('database') || t.includes('data')) return Database;
    if (t.includes('cloud') || t.includes('aws')) return Cloud;
    if (t.includes('language') || t.includes('code')) return Code2;
    if (t.includes('tool') || t.includes('dev')) return Terminal;
    return Wrench;
};

const getCategoryStyles = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('frontend') || t.includes('ui')) {
        return {
            iconBg: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200/60 dark:border-cyan-800/30 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-100 group-hover:border-cyan-400/50',
            glow: 'bg-cyan-500/10 dark:bg-cyan-500/5 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/10',
            border: 'hover:border-cyan-500/40 dark:hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)] dark:hover:shadow-[0_8px_30px_rgba(6,182,212,0.06)]',
            badge: 'border-slate-200/60 bg-slate-50/70 hover:border-cyan-500/40 hover:bg-cyan-50/40 hover:text-cyan-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-cyan-950/20 dark:hover:text-cyan-300'
        };
    }
    if (t.includes('backend') || t.includes('server')) {
        return {
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 group-hover:border-emerald-400/50',
            glow: 'bg-emerald-500/10 dark:bg-emerald-500/5 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/10',
            border: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)]',
            badge: 'border-slate-200/60 bg-slate-50/70 hover:border-emerald-500/40 hover:bg-emerald-50/40 hover:text-emerald-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300'
        };
    }
    if (t.includes('database') || t.includes('data')) {
        return {
            iconBg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200/60 dark:border-purple-800/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 group-hover:border-purple-400/50',
            glow: 'bg-purple-500/10 dark:bg-purple-500/5 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/10',
            border: 'hover:border-purple-500/40 dark:hover:border-purple-500/30 hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)] dark:hover:shadow-[0_8px_30px_rgba(168,85,247,0.06)]',
            badge: 'border-slate-200/60 bg-slate-50/70 hover:border-purple-500/40 hover:bg-purple-50/40 hover:text-purple-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-purple-950/20 dark:hover:text-purple-300'
        };
    }
    if (t.includes('cloud') || t.includes('aws')) {
        return {
            iconBg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/30 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 group-hover:border-amber-400/50',
            glow: 'bg-amber-500/10 dark:bg-amber-500/5 group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/10',
            border: 'hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_8px_30px_rgba(245,158,11,0.06)]',
            badge: 'border-slate-200/60 bg-slate-50/70 hover:border-amber-500/40 hover:bg-amber-50/40 hover:text-amber-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-amber-950/20 dark:hover:text-amber-300'
        };
    }
    if (t.includes('tool') || t.includes('dev')) {
        return {
            iconBg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 group-hover:border-indigo-400/50',
            glow: 'bg-indigo-500/10 dark:bg-indigo-500/5 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/10',
            border: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]',
            badge: 'border-slate-200/60 bg-slate-50/70 hover:border-indigo-500/40 hover:bg-indigo-50/40 hover:text-indigo-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-300'
        };
    }
    return {
        iconBg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200/60 dark:border-teal-800/30 text-teal-600 dark:text-teal-400 group-hover:bg-teal-100 group-hover:border-teal-400/50',
        glow: 'bg-teal-500/10 dark:bg-teal-500/5 group-hover:bg-teal-500/20 dark:group-hover:bg-teal-500/10',
        border: 'hover:border-teal-500/40 dark:hover:border-teal-500/30 hover:shadow-[0_8px_30px_rgba(20,184,166,0.08)] dark:hover:shadow-[0_8px_30px_rgba(20,184,166,0.06)]',
        badge: 'border-slate-200/60 bg-slate-50/70 hover:border-teal-500/40 hover:bg-teal-50/40 hover:text-teal-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-teal-950/20 dark:hover:text-teal-300'
    };
};

const Skills = ({ skills, intro }: SkillsProps) => {
    return (
        <section id="skills" className="relative border-b border-slate-200/80 bg-transparent py-24 overflow-hidden dark:border-white/5">
            {/* Background Details */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

            <div className="section-shell relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center rounded-full bg-teal-50/90 px-4 py-1.5 mb-4 border border-teal-500/20 dark:bg-teal-500/10"
                    >
                        <Sparkles className="mr-2 h-4 w-4 text-teal-700 dark:text-teal-400" />
                        <span className="text-sm font-semibold text-teal-700 uppercase tracking-widest dark:text-teal-300">Expertise</span>
                    </motion.div>
                    <motion.h2
                        className="text-4xl font-black text-slate-950 dark:text-white sm:text-5xl tracking-tight mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-600 dark:from-teal-400 dark:to-cyan-500">Skills</span>
                    </motion.h2>
                    <motion.p
                        className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        {intro}
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {skills.map((category) => {
                        const Icon = getCategoryIcon(category.title);
                        const styles = getCategoryStyles(category.title);
                        return (
                            <motion.div
                                key={category.title}
                                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-8 shadow-md shadow-slate-200/40 backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0c111e]/40 dark:shadow-none ${styles.border}`}
                                variants={fadeUp}
                            >
                                {/* Decorative dynamic category glow */}
                                <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-[28px] transition-all duration-500 pointer-events-none ${styles.glow}`} />

                                <div className="relative z-10 flex items-center gap-4 mb-6">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 group-hover:scale-100 ${styles.iconBg}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-950 dark:text-slate-100">{category.title}</h3>
                                </div>

                                <div className="relative z-10 flex flex-wrap gap-2.5">
                                    {category.items.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 cursor-default ${styles.badge}`}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
