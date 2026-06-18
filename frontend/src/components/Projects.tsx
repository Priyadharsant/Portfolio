import { motion } from 'framer-motion';
import { CheckSquare, ExternalLink, Github, Globe2, GraduationCap, ShoppingBag } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, staggerContainer, fadeUp } from '../utils/motion';
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
        <section id="projects" className="border-b border-slate-200/80 bg-transparent py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.06),transparent_50%)] pointer-events-none" />

            <div className="section-shell relative z-10">
                <SectionHeader kicker="Selected work" title="Projects" copy={intro} />

                {/* Projects Grid */}
                <motion.div
                    className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {projects.map((project) => {
                        const ProjectIcon = getProjectIcon(project.title);
                        return (
                            <motion.div
                                variants={fadeUp}
                                key={project.title}
                                className="group glass-panel interactive-card overflow-hidden rounded-2xl border border-slate-200 bg-white/40 dark:border-slate-800/80 dark:bg-[#0c111e]/40 shadow-xl backdrop-blur-md flex flex-col h-full"
                                whileHover={cardHover}
                            >
                                {/* Header Image space (Abstract Mockup representation) */}
                                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-[#06070b] flex-none">
                                    <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${project.accent}`} />
                                    {/* Decorative dotted/mesh grid */}
                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.04)_0_1px,transparent_1px_32px)] opacity-35 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_32px)] pointer-events-none" />

                                    {/* Glowing backdrop spotlight */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.12),transparent_45%)] pointer-events-none" />

                                    {/* Node visualization */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-teal-500/20 bg-white/80 dark:bg-slate-950/80 shadow-lg text-teal-600 dark:text-teal-400 transform transition-transform duration-300 group-hover:scale-100"
                                        >
                                            <ProjectIcon className="h-9 w-9" />
                                        </div>
                                    </div>

                                    {/* Status tag pill */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-300">
                                        <span className={`h-1.5 w-1.5 rounded-full ${project.status === 'on process' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                                        {project.status === 'on process' ? 'In progress' : 'Live Build'}
                                    </div>
                                </div>

                                {/* Card Body content */}
                                <div className="relative p-6 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-snug">{project.title}</h3>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-400 flex-grow">{project.description}</p>

                                    {/* Technologies */}
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {project.stack.map((tech) => (
                                            <span key={tech} className="rounded-md border border-slate-200/80 bg-slate-50/70 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Key Features list */}
                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-3">Key Features</p>
                                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                            {project.features.map((feature) => (
                                                <li key={feature} className="flex gap-2.5 items-center">
                                                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-teal-500 dark:bg-teal-400" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="mt-6 flex flex-wrap gap-3 pt-2">
                                        <motion.a
                                            aria-label={`GitHub repository for ${project.title}`}
                                            href={project.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/50 px-4 py-2.5 text-xs font-bold text-slate-700 backdrop-blur hover:bg-slate-50 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Github className="h-4 w-4" />
                                            Repository
                                        </motion.a>
                                        {project.status !== 'on process' && (
                                            <motion.a
                                                aria-label={`Live demo for ${project.title}`}
                                                href={project.demo}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/10 hover:shadow-lg dark:from-teal-500 dark:to-cyan-500 dark:text-slate-950"
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Launch Site
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
