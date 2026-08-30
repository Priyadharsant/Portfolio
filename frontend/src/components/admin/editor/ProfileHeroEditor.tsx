import React from 'react';
import type { PortfolioData } from '../../../types/portfolio';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export default function ProfileHeroEditor({ data, onChange }: Props) {
  const handleProfileChange = (field: keyof PortfolioData['profile'], value: string) => {
    onChange({
      ...data,
      profile: { ...data.profile, [field]: value }
    });
  };

  const handleHeroChange = (field: keyof PortfolioData['hero'], value: string | string[]) => {
    onChange({
      ...data,
      hero: { ...data.hero, [field]: value }
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...data.hero.highlights];
    newHighlights[index] = value;
    handleHeroChange('highlights', newHighlights);
  };

  const addHighlight = () => {
    handleHeroChange('highlights', [...data.hero.highlights, 'New Highlight']);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...data.hero.highlights];
    newHighlights.splice(index, 1);
    handleHeroChange('highlights', newHighlights);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
            <input type="text" value={data.profile.name} onChange={e => handleProfileChange('name', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</span>
            <input type="text" value={data.profile.title} onChange={e => handleProfileChange('title', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tagline</span>
            <input type="text" value={data.profile.tagline} onChange={e => handleProfileChange('tagline', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
            <input type="email" value={data.profile.email} onChange={e => handleProfileChange('email', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resume URL</span>
            <input type="url" value={data.profile.resume} onChange={e => handleProfileChange('resume', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</span>
            <input type="url" value={data.profile.github} onChange={e => handleProfileChange('github', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn URL</span>
            <input type="url" value={data.profile.linkedin} onChange={e => handleProfileChange('linkedin', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LeetCode URL</span>
            <input type="url" value={data.profile.leetcode} onChange={e => handleProfileChange('leetcode', e.target.value)} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">CodeChef URL</span>
            <input type="url" value={data.profile.codechef} onChange={e => handleProfileChange('codechef', e.target.value)} className="input-field" />
          </label>
        </div>
      </section>

      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Hero Section</h2>
        <div className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kicker</span>
            <input type="text" value={data.hero.kicker} onChange={e => handleHeroChange('kicker', e.target.value)} className="input-field" />
          </label>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Highlights</span>
              <button onClick={addHighlight} className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-500/10 px-2 py-1 rounded">
                <Plus className="w-3 h-3" /> Add Highlight
              </button>
            </div>
            <div className="space-y-2">
              {data.hero.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={highlight} onChange={e => updateHighlight(index, e.target.value)} className="input-field flex-1" />
                  <button onClick={() => removeHighlight(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
