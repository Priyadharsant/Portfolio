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

const Skills = ({ skills, intro }: SkillsProps) => {
    return (
        <section id="skills" className="relative border-b border-white/5 bg-transparent py-24 overflow-hidden">
            {/* Background Details */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.05),transparent_50%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

            <div className="section-shell relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center rounded-full bg-teal-500/10 px-4 py-1.5 mb-4 border border-teal-500/20"
                    >
                        <Sparkles className="mr-2 h-4 w-4 text-teal-400" />
                        <span className="text-sm font-semibold text-teal-300 uppercase tracking-widest">Expertise</span>
                    </motion.div>
                    <motion.h2
                        className="text-4xl font-black text-white sm:text-5xl tracking-tight mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Skills</span>
                    </motion.h2>
                    <motion.p
                        className="text-lg text-slate-400 leading-relaxed"
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
                        return (
                            <motion.div
                                key={category.title}
                                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm transition-all hover:border-teal-500/30 hover:bg-slate-800/60 hover:shadow-[0_4px_15px_rgba(45,212,191,0.1)]"
                                variants={fadeUp}
                            >
                                {/* Decorative elements */}
                                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-teal-500/10 blur-[24px] transition-all group-hover:bg-teal-500/20" />

                                <div className="relative z-10 flex items-center gap-4 mb-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-teal-400 shadow-inner group-hover:scale-110 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 transition-all duration-300">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-100">{category.title}</h3>
                                </div>

                                <div className="relative z-10 flex flex-wrap gap-2.5">
                                    {category.items.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            className="rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-300"
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