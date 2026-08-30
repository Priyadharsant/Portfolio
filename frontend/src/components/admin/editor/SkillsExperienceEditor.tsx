import React from 'react';
import type { PortfolioData } from '../../../types/portfolio';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export default function SkillsExperienceEditor({ data, onChange }: Props) {
  // Skills
  const updateSkillCategory = (catIndex: number, field: string, value: any) => {
    const newSkills = [...data.skills];
    newSkills[catIndex] = { ...newSkills[catIndex], [field]: value };
    onChange({ ...data, skills: newSkills });
  };

  const addSkillCategory = () => {
    onChange({ ...data, skills: [...data.skills, { title: 'New Category', items: [] }] });
  };

  const removeSkillCategory = (catIndex: number) => {
    const newSkills = [...data.skills];
    newSkills.splice(catIndex, 1);
    onChange({ ...data, skills: newSkills });
  };

  const addSkillItem = (catIndex: number) => {
    const items = [...data.skills[catIndex].items, 'New Skill'];
    updateSkillCategory(catIndex, 'items', items);
  };

  const updateSkillItem = (catIndex: number, itemIndex: number, value: string) => {
    const items = [...data.skills[catIndex].items];
    items[itemIndex] = value;
    updateSkillCategory(catIndex, 'items', items);
  };

  const removeSkillItem = (catIndex: number, itemIndex: number) => {
    const items = [...data.skills[catIndex].items];
    items.splice(itemIndex, 1);
    updateSkillCategory(catIndex, 'items', items);
  };

  // Experience
  const updateExperience = (field: keyof PortfolioData['experience'], value: any) => {
    onChange({
      ...data,
      experience: { ...data.experience, [field]: value }
    });
  };

  const addExpPoint = () => {
    const points = [...data.experience.points, ''];
    updateExperience('points', points);
  };

  const updateExpPoint = (ptIndex: number, value: string) => {
    const points = [...data.experience.points];
    points[ptIndex] = value;
    updateExperience('points', points);
  };

  const removeExpPoint = (ptIndex: number) => {
    const points = [...data.experience.points];
    points.splice(ptIndex, 1);
    updateExperience('points', points);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Skills</h2>
          <button onClick={addSkillCategory} className="flex items-center gap-1 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded hover:bg-teal-100 transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        
        <label className="flex flex-col gap-1 mb-6">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills Intro Text</span>
          <input type="text" value={data.skillsIntro} onChange={e => onChange({ ...data, skillsIntro: e.target.value })} className="input-field" />
        </label>

        <div className="space-y-6">
          {data.skills.map((category, catIndex) => (
            <div key={catIndex} className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <input 
                  type="text" 
                  value={category.title} 
                  onChange={e => updateSkillCategory(catIndex, 'title', e.target.value)} 
                  className="input-field flex-1 font-bold" 
                />
                <button onClick={() => removeSkillCategory(catIndex)} className="text-red-500 hover:text-red-600 p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-white/10">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <input type="text" value={item} onChange={e => updateSkillItem(catIndex, itemIndex, e.target.value)} className="input-field flex-1 text-sm py-1.5" />
                    <button onClick={() => removeSkillItem(catIndex, itemIndex)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addSkillItem(catIndex)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-500 mt-2">
                  <Plus className="w-3 h-3" /> Add Skill
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Experience</h2>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Job Title</span>
              <input type="text" value={data.experience.title} onChange={e => updateExperience('title', e.target.value)} className="input-field" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Organization</span>
              <input type="text" value={data.experience.organization} onChange={e => updateExperience('organization', e.target.value)} className="input-field" />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs text-slate-500">Badge (e.g. 2021 - Present)</span>
              <input type="text" value={data.experience.badge} onChange={e => updateExperience('badge', e.target.value)} className="input-field" />
            </label>
          </div>

          <div>
            <span className="text-xs text-slate-500 mb-2 block">Bullet Points</span>
            <div className="space-y-2">
              {data.experience.points.map((point, ptIndex) => (
                <div key={ptIndex} className="flex gap-2">
                  <textarea value={point} onChange={e => updateExpPoint(ptIndex, e.target.value)} rows={2} className="input-field flex-1 text-sm resize-y" />
                  <button onClick={() => removeExpPoint(ptIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded h-fit">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={addExpPoint} className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-500 mt-2">
                <Plus className="w-3 h-3" /> Add Point
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
