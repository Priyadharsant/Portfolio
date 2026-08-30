import React from 'react';
import type { PortfolioData } from '../../../types/portfolio';
import { Reorder } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export default function ProjectsAchievementsEditor({ data, onChange }: Props) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  // Projects
  const updateProject = (index: number, field: string, value: any) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...data, projects: newProjects });
  };

  const addProject = () => {
    onChange({
      ...data,
      projects: [...data.projects, { title: '', description: '', stack: [], github: '', demo: '', status: '', accent: '', features: [] }]
    });
  };

  const removeProject = (index: number) => {
    const newProjects = [...data.projects];
    newProjects.splice(index, 1);
    onChange({ ...data, projects: newProjects });
  };

  const updateArrayString = (arr: string[], index: number, value: string) => {
    const newArr = [...arr];
    newArr[index] = value;
    return newArr;
  };

  const removeArrayString = (arr: string[], index: number) => {
    const newArr = [...arr];
    newArr.splice(index, 1);
    return newArr;
  };

  // Achievements
  const updateAchievement = (index: number, field: string, value: any) => {
    const newAchieve = [...data.achievements];
    newAchieve[index] = { ...newAchieve[index], [field]: value };
    onChange({ ...data, achievements: newAchieve });
  };

  const addAchievement = () => {
    onChange({ ...data, achievements: [...data.achievements, { title: '', description: '' }] });
  };

  const removeAchievement = (index: number) => {
    const newAchieve = [...data.achievements];
    newAchieve.splice(index, 1);
    onChange({ ...data, achievements: newAchieve });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h2>
          <button onClick={addProject} className="flex items-center gap-1 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded hover:bg-teal-100 transition-colors">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        <label className="flex flex-col gap-1 mb-6">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Projects Intro Text</span>
          <input type="text" value={data.projectsIntro} onChange={e => onChange({ ...data, projectsIntro: e.target.value })} className="input-field" />
        </label>

        <Reorder.Group axis="y" values={data.projects} onReorder={(newProjects) => onChange({ ...data, projects: newProjects })} className="space-y-8">
          {data.projects.map((project, projIndex) => (
            <Reorder.Item key={project.title || projIndex} value={project} className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 relative flex flex-col">
              <div className="absolute top-4 left-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between ml-8 mb-2">
                <div 
                  className="flex-1 cursor-pointer select-none"
                  onClick={() => setExpandedIndex(expandedIndex === projIndex ? null : projIndex)}
                >
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {project.title || 'Untitled Project'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-[250px] md:max-w-md">
                    {project.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setExpandedIndex(expandedIndex === projIndex ? null : projIndex)}
                    className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded"
                  >
                    {expandedIndex === projIndex ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button onClick={() => removeProject(projIndex)} className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {expandedIndex === projIndex && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 pt-4 border-t border-slate-200 dark:border-white/10">
                    <label className="flex flex-col gap-1 md:col-span-2 pr-8">
                      <span className="text-xs text-slate-500">Title</span>
                      <input type="text" value={project.title} onChange={e => updateProject(projIndex, 'title', e.target.value)} className="input-field font-bold" />
                    </label>
                    <label className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-xs text-slate-500">Description</span>
                      <textarea value={project.description} onChange={e => updateProject(projIndex, 'description', e.target.value)} rows={3} className="input-field resize-y" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500">GitHub Link</span>
                      <input type="url" value={project.github} onChange={e => updateProject(projIndex, 'github', e.target.value)} className="input-field text-sm" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500">Demo Link</span>
                      <input type="url" value={project.demo} onChange={e => updateProject(projIndex, 'demo', e.target.value)} className="input-field text-sm" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500">Status (e.g. In Development)</span>
                      <input type="text" value={project.status} onChange={e => updateProject(projIndex, 'status', e.target.value)} className="input-field text-sm" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500">Accent Color Class (e.g. from-blue-500/20)</span>
                      <input type="text" value={project.accent} onChange={e => updateProject(projIndex, 'accent', e.target.value)} className="input-field text-sm font-mono" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/10 ml-6">
                    <div>
                      <span className="text-xs text-slate-500 mb-2 block">Tech Stack</span>
                      <div className="space-y-2">
                        {project.stack.map((tech, techIndex) => (
                          <div key={techIndex} className="flex gap-2">
                            <input type="text" value={tech} onChange={e => updateProject(projIndex, 'stack', updateArrayString(project.stack, techIndex, e.target.value))} className="input-field flex-1 text-sm py-1.5" />
                            <button onClick={() => updateProject(projIndex, 'stack', removeArrayString(project.stack, techIndex))} className="text-red-500 p-1.5 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => updateProject(projIndex, 'stack', [...project.stack, ''])} className="text-xs text-slate-500 hover:text-teal-500 flex items-center gap-1 mt-2">
                          <Plus className="w-3 h-3" /> Add Tech
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 mb-2 block">Key Features</span>
                      <div className="space-y-2">
                        {project.features.map((feat, featIndex) => (
                          <div key={featIndex} className="flex gap-2">
                            <textarea value={feat} onChange={e => updateProject(projIndex, 'features', updateArrayString(project.features, featIndex, e.target.value))} rows={2} className="input-field flex-1 text-sm resize-y" />
                            <button onClick={() => updateProject(projIndex, 'features', removeArrayString(project.features, featIndex))} className="text-red-500 p-1.5 hover:bg-red-50 rounded h-fit">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => updateProject(projIndex, 'features', [...project.features, ''])} className="text-xs text-slate-500 hover:text-teal-500 flex items-center gap-1 mt-2">
                          <Plus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>

      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Achievements</h2>
          <button onClick={addAchievement} className="flex items-center gap-1 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded hover:bg-teal-100 transition-colors">
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>

        <div className="space-y-4">
          {data.achievements.map((achieve, aIndex) => (
            <div key={aIndex} className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex gap-4">
              <div className="flex-1 space-y-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Title</span>
                  <input type="text" value={achieve.title} onChange={e => updateAchievement(aIndex, 'title', e.target.value)} className="input-field font-semibold" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Description</span>
                  <textarea value={achieve.description} onChange={e => updateAchievement(aIndex, 'description', e.target.value)} rows={2} className="input-field resize-y" />
                </label>
              </div>
              <button onClick={() => removeAchievement(aIndex)} className="text-red-500 hover:text-red-600 p-2 h-fit">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
