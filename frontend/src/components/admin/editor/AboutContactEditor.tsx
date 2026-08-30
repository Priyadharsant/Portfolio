
import type { PortfolioData } from '../../../types/portfolio';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export default function AboutContactEditor({ data, onChange }: Props) {
  const handleAboutChange = (field: keyof PortfolioData['about'], value: any) => {
    onChange({
      ...data,
      about: { ...data.about, [field]: value }
    });
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...data.about.paragraphs];
    newParagraphs[index] = value;
    handleAboutChange('paragraphs', newParagraphs);
  };

  const addParagraph = () => {
    handleAboutChange('paragraphs', [...data.about.paragraphs, '']);
  };

  const removeParagraph = (index: number) => {
    const newParagraphs = [...data.about.paragraphs];
    newParagraphs.splice(index, 1);
    handleAboutChange('paragraphs', newParagraphs);
  };

  const updateWorkingOn = (index: number, value: string) => {
    const newWorkingOn = [...data.about.currentlyWorkingOn];
    newWorkingOn[index] = value;
    handleAboutChange('currentlyWorkingOn', newWorkingOn);
  };

  const addWorkingOn = () => {
    handleAboutChange('currentlyWorkingOn', [...data.about.currentlyWorkingOn, '']);
  };

  const removeWorkingOn = (index: number) => {
    const newWorkingOn = [...data.about.currentlyWorkingOn];
    newWorkingOn.splice(index, 1);
    handleAboutChange('currentlyWorkingOn', newWorkingOn);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">About Section</h2>
        <div className="space-y-6">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</span>
            <input type="text" value={data.about.title} onChange={e => handleAboutChange('title', e.target.value)} className="input-field" />
          </label>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Paragraphs</span>
              <button onClick={addParagraph} className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-500/10 px-2 py-1 rounded">
                <Plus className="w-3 h-3" /> Add Paragraph
              </button>
            </div>
            <div className="space-y-3">
              {data.about.paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea value={p} onChange={e => updateParagraph(i, e.target.value)} rows={3} className="input-field flex-1 resize-y" />
                  <button onClick={() => removeParagraph(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors h-fit mt-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Currently Working On</span>
              <button onClick={addWorkingOn} className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-500/10 px-2 py-1 rounded">
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {data.about.currentlyWorkingOn.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={item} onChange={e => updateWorkingOn(i, e.target.value)} className="input-field flex-1" />
                  <button onClick={() => removeWorkingOn(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Contact & Footer</h2>
          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Intro</span>
              <textarea value={data.contact.intro} onChange={e => onChange({ ...data, contact: { intro: e.target.value }})} rows={4} className="input-field resize-y" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Footer Copyright</span>
              <input type="text" value={data.footer.copyright} onChange={e => onChange({ ...data, footer: { copyright: e.target.value }})} className="input-field" />
            </label>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Resume Config</h2>
          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resume Description</span>
              <textarea value={data.resume.description} onChange={e => onChange({ ...data, resume: { description: e.target.value }})} rows={4} className="input-field resize-y" />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
