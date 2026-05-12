import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp, staggerContainer } from '../utils/motion';
import SectionHeader from './SectionHeader';

type ExperienceProps = {
    experience: PortfolioData['experience'];
};

const Experience = ({ experience }: ExperienceProps) => {
    return (
        <section id="experience" className="border-b border-white/10 bg-transparent">
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
                                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border border-teal-300/20 bg-teal-400/10 text-teal-300"
                                animate={{ rotate: [0, 4, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Briefcase className="h-6 w-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white">{experience.title}</h3>
                            <p className="mt-2 text-slate-400">{experience.organization}</p>
                        </div>
                        <span className="w-fit rounded-md border border-teal-300/30 bg-teal-300/10 px-3 py-2 text-sm font-semibold text-teal-200 shadow-sm shadow-teal-950/30">
                            {experience.badge}
                        </span>
                    </div>
                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-2"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        {experience.points.map((point) => (
                            <motion.div key={point} variants={fadeUp} className="rounded-md border border-white/10 bg-slate-950/35 p-4 text-slate-300">
                                <div className="flex gap-3">
                                <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-teal-300" />
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
