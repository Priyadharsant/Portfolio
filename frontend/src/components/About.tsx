import { motion } from 'framer-motion';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp, staggerContainer } from '../utils/motion';
import SectionHeader from './SectionHeader';

type AboutProps = {
    about: PortfolioData['about'];
};

const About = ({ about }: AboutProps) => {
    return (
        <section id="about" className="border-b border-white/10 bg-transparent">
            <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                <SectionHeader kicker="About" title={about.title} />
                <motion.div
                    className="space-y-5 text-base leading-8 text-slate-300"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                >
                    {about.paragraphs.map((paragraph) => (
                        <motion.p variants={fadeUp} key={paragraph}>{paragraph}</motion.p>
                    ))}
                    <div className="grid gap-3 pt-3 sm:grid-cols-3">
                        {about.currentlyWorkingOn.map((item) => (
                            <motion.div
                                key={item}
                                className="interactive-card rounded-md border border-white/10 bg-white/[0.055] p-4 text-sm font-semibold text-teal-100 shadow-lg shadow-black/10"
                                variants={fadeUp}
                                whileHover={cardHover}
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
