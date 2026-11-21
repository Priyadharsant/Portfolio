import { motion } from 'framer-motion';
import { CheckSquare, ExternalLink, Github, Globe2, GraduationCap, ShoppingBag } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';
import { cardHover, staggerContainer, scrollRevealCard } from '../utils/motion';
import SectionHeader from './SectionHeader';
import DiffHighlight from './admin/DiffHighlight';

type ProjectsProps = {
    projects: PortfolioData['projects'];
    intro: PortfolioData['projectsIntro'];
    originalProjects?: PortfolioData['projects'];
    originalIntro?: PortfolioData['projectsIntro'];
};

const Projects = ({ projects, intro, originalProjects, originalIntro }: ProjectsProps) => {
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
                <SectionHeader 
                    kicker="Selected work" 
                    title="Projects" 
                    copy={intro} 
                    originalCopy={originalIntro} 
                />

                {/* Projects Grid */}
                <motion.div
                    className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {projects.map((project, index) => {
                        const originalProject = originalProjects?.[index];
                        const ProjectIcon = getProjectIcon(project.title);
                        return (
                            <motion.div
                                variants={scrollRevealCard}
                                key={`${project.title}-${index}`}
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
                                            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-teal-500/20 bg-white/80 dark:bg-slate-950/80 shadow-lg text-teal-600 dark:text-teal-400 transform transition-transform duration-300 group-hover:scale-105"
                                        >
                                            <ProjectIcon className="h-9 w-9" />
                                        </div>
                                    </div>

                                    {/* Status tag pill */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                                        <span>{project.status || 'Production'}</span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow justify-between">
                                    <div>
                                        {/* Meta category row */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                                Featured Architecture
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 transition-colors">
                                            <DiffHighlight current={project.title} original={originalProject?.title}>
                                                {project.title}
                                            </DiffHighlight>
                                        </h3>

                                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                            <DiffHighlight current={project.description} original={originalProject?.description}>
                                                {project.description}
                                            </DiffHighlight>
                                        </p>

                                        {/* Technology Tags with micro-pill aesthetics */}
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {project.stack?.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.04] dark:text-slate-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6 dark:border-slate-800/80">
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/btn inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
                                            >
                                                <Github className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
                                                Source Code
                                            </a>
                                        )}

                                        {project.demo && (
                                            <a
                                                href={project.demo}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-600 hover:to-cyan-700 transition-all duration-200"
                                            >
                                                Live Experience
                                                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                            </a>
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
