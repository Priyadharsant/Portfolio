import { motion } from 'framer-motion';
import { Award, Code, Github, Trophy } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp, staggerContainer } from '../utils/motion';

type AchievementsProps = {
    achievements: PortfolioData['achievements'];
};

const Achievements = ({ achievements }: AchievementsProps) => {
    const icons = [Code, Award, Trophy, Github];

    return (
        <section id="achievements" className="border-b border-white/10 bg-slate-950">
            <div className="section-shell">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                >
                    Achievements & Profiles
                </motion.h2>
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
                            className="glass-panel flex gap-4 rounded-lg p-6"
                            variants={fadeUp}
                            whileHover={cardHover}
                        >
                            <motion.div
                                className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-teal-400/10 text-teal-300"
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
