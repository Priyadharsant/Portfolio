import { motion } from 'framer-motion';
import { BadgeCheck, Briefcase, CheckCircle2 } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp, staggerContainer } from '../utils/motion';
import SectionHeader from './SectionHeader';

type ExperienceProps = {
    experience: PortfolioData['experience'];
};

const Experience = ({ experience }: ExperienceProps) => {
    return (
        <section id="experience" className="border-b border-slate-200/80 bg-transparent dark:border-white/10">
            <div className="section-shell">
                <SectionHeader kicker="Practice" title="Experience" />
                <motion.div
                    className="glass-panel interactive-card mt-10 rounded-lg p-6 sm:p-8"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={cardHover}
                >
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <motion.div
                                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border border-teal-500/25 bg-teal-100/70 text-teal-700 dark:border-teal-300/20 dark:bg-teal-400/10 dark:text-teal-300"
                                animate={{ rotate: [0, 4, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Briefcase className="h-6 w-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{experience.title}</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">{experience.organization}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 w-fit rounded-md border border-teal-500/30 bg-teal-100/70 px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm shadow-teal-200/60 dark:border-teal-300/30 dark:bg-teal-300/10 dark:text-teal-200 dark:shadow-teal-950/30">
                            <BadgeCheck className="h-4 w-4" />
                            {experience.badge}
                        </div>
                    </div>
                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-2"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        {experience.points.map((point) => (
                            <motion.div key={point} variants={fadeUp} className="rounded-md border border-slate-200/80 bg-slate-50/90 p-4 text-slate-700 dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-300">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-teal-600 dark:text-teal-300" />
                                    <p>{point}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Experience;
