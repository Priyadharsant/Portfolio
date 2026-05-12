import { motion } from 'framer-motion';
import { CheckSquare, ExternalLink, Github, Globe2, GraduationCap, ShoppingBag } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, fadeUp, staggerContainer } from '../utils/motion';
import SectionHeader from './SectionHeader';

type ProjectsProps = {
    projects: PortfolioData['projects'];
    intro: PortfolioData['projectsIntro'];
};

const Projects = ({ projects, intro }: ProjectsProps) => {
    const getProjectIcon = (title: string) => {
        const normalizedTitle = title.toLowerCase();

        if (normalizedTitle.includes('todo')) {
            return CheckSquare;
        }

        if (normalizedTitle.includes('kart') || normalizedTitle.includes('commerce')) {
            return ShoppingBag;
        }

        if (normalizedTitle.includes('admission') || normalizedTitle.includes('college')) {
            return GraduationCap;
        }

        return Globe2;
    };

    return (
        <section id="projects" className="border-b border-white/10 bg-transparent">
            <div className="section-shell">
                <SectionHeader kicker="Selected work" title="Projects" copy={intro} />
                <motion.div
                    className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {projects.map((project) => {
                        const ProjectIcon = getProjectIcon(project.title);

                        return (
                            <motion.div
                                key={project.title}
                                className="glass-panel interactive-card overflow-hidden rounded-lg"
                                variants={fadeUp}
                                whileHover={cardHover}
                            >
                                <div className="relative h-52 overflow-hidden bg-[#06070b]">
                                    <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${project.accent}`} />
                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_34px)] opacity-35" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.16),transparent_28%),linear-gradient(180deg,transparent,rgba(6,7,11,0.72))]" />
                                    <motion.div
                                        className="absolute inset-x-6 top-6 flex items-start justify-between gap-4"
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-md border border-teal-300/25 bg-[#0b111c] text-teal-200 shadow-sm shadow-black/30">
                                            <ProjectIcon className="h-7 w-7" />
                                        </div>
                                        <p className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300 backdrop-blur">
                                            {project.status === 'on process' ? 'In progress' : 'Live build'}
                                        </p>
                                    </motion.div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="max-w-xs text-xl font-black text-white">{project.title}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {project.stack.slice(0, 3).map((tech) => (
                                                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative p-6">
                                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                                    <p className="mt-3 leading-7 text-slate-300">{project.description}</p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {project.stack.map((tech) => (
                                            <span key={tech} className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-slate-200">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <ul className="mt-5 space-y-2 text-sm text-slate-300">
                                        {project.features.map((feature) => (
                                            <li key={feature} className="flex gap-2">
                                                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-teal-300" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <motion.a href={project.github} target="_blank" rel="noreferrer" className="secondary-action" whileTap={{ scale: 0.98 }}>
                                            <Github className="h-4 w-4" />
                                            GitHub
                                        </motion.a>
                                        {project.status !== 'on process' && (
                                            <motion.a href={project.demo} target="_blank" rel="noreferrer" className="primary-action" whileTap={{ scale: 0.98 }}>
                                                <ExternalLink className="h-4 w-4" />
                                                Visit Site
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
