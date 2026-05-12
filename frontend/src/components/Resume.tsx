import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import SectionHeader from './SectionHeader';

type ResumeProps = {
    profile: PortfolioData['profile'];
    resume: PortfolioData['resume'];
};

const Resume = ({ profile, resume }: ResumeProps) => {
    return (
        <section id="resume" className="border-b border-white/10 bg-transparent">
            <div className="section-shell text-center">
                <SectionHeader kicker="Snapshot" title="Resume" copy={resume.description} align="center" />
                <motion.div
                    className="mx-auto mt-8 flex max-w-xl flex-col justify-center gap-3 sm:flex-row"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.a
                        href={profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-action min-h-12 flex-1"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Eye className="h-5 w-5" />
                        View Resume
                    </motion.a>
                    <motion.a
                        href={profile.resume}
                        download
                        className="primary-action min-h-12 flex-1"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Download className="h-5 w-5" />
                        Download Resume
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Resume;
