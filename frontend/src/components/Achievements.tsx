import { motion } from 'framer-motion';
import { Award, Code, Github, Trophy } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp, staggerContainer } from '../utils/motion';
import SectionHeader from './SectionHeader';

type AchievementsProps = {
    achievements: PortfolioData['achievements'];
};

const Achievements = ({ achievements }: AchievementsProps) => {
    const icons = [Code, Award, Trophy, Github];

    return (
        <section id="achievements" className="border-b border-white/10 bg-transparent">
            <div className="section-shell">
                <SectionHeader kicker="Proof points" title="Achievements & Profiles" />
                <motion.div
                    className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.title}
                            className="glass-panel interactive-card flex gap-4 rounded-lg p-6"
                            variants={fadeUp}
                            whileHover={cardHover}
                        >
                            <motion.div
                                className="relative flex h-11 w-11 flex-none items-center justify-center rounded-md border border-teal-300/20 bg-teal-400/10 text-teal-300"
                                whileHover={{ color: '#99f6e4' }}
                            >
                                {(() => {
                                    const Icon = icons[index] ?? Trophy;
                                    return <Icon className="h-5 w-5" />;
                                })()}
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                                <p className="mt-2 leading-7 text-slate-300">{achievement.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Achievements;
