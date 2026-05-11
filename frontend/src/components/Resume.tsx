import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { fadeUp } from '../utils/motion';

type ResumeProps = {
    profile: PortfolioData['profile'];
    resume: PortfolioData['resume'];
};

const Resume = ({ profile, resume }: ResumeProps) => {
    return (
        <section id="resume" className="border-b border-white/10 bg-[#06070b]">
            <div className="section-shell text-center">
                <motion.h2
                    className="section-title"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                >
                    Resume
                </motion.h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-300">{resume.description}</p>
                <motion.div
                    className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.a
                        href={profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-teal-300 hover:text-teal-200"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Eye className="h-5 w-5" />
                        View Resume
                    </motion.a>
                    <motion.a
                        href={profile.resume}
                        download
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300"
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
