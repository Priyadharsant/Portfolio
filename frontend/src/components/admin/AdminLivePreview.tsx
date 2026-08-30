import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LogOut, Save, RefreshCw, AlertCircle, CheckCircle2, X, Undo2, History, BarChart3 } from 'lucide-react';
import { apiUrl } from '../../utils/api';
import type { PortfolioData } from '../../types/portfolio';

// Existing Portfolio Components
import Hero from '../Hero';
import About from '../About';
import Skills from '../Skills';
import Experience from '../Experience';
import Projects from '../Projects';
import Achievements from '../Achievements';
import Resume from '../Resume';
import Contact from '../Contact';
import Footer from '../Footer';
import MouseBackground from '../MouseBackground';
import FloatingThemeToggle from '../FloatingThemeToggle';
import ScrollToTop from '../ScrollToTop';
import ScrollProgress from '../ScrollProgress';
import SectionGlowOverlay from '../SectionGlowOverlay';
import LoadingScreen from '../LoadingScreen';
import { TooltipProvider } from '../TooltipContext';
import Tooltip from '../Tooltip';

// Admin Components
import EditableSection from './EditableSection';
import ProfileHeroEditor from './editor/ProfileHeroEditor';
import AboutContactEditor from './editor/AboutContactEditor';
import SkillsExperienceEditor from './editor/SkillsExperienceEditor';
import ProjectsAchievementsEditor from './editor/ProjectsAchievementsEditor';
import HistoryViewer from './HistoryViewer';
import AnalyticsViewer from './AnalyticsViewer';
import PushNotificationPrompt from './PushNotificationPrompt';

type ActiveModal = 'none' | 'profile' | 'about' | 'skills' | 'projects' | 'history' | 'revert-confirm' | 'analytics';

interface AdminLivePreviewProps {
  token: string;
  onLogout: () => void;
}

export default function AdminLivePreview({ token, onLogout }: AdminLivePreviewProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [originalData, setOriginalData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [highlightedSections, setHighlightedSections] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchData();
    
    // Check if we should show the push notification prompt
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const isRegistered = localStorage.getItem('pushDeviceRegistered');
      if (!isRegistered && Notification.permission !== 'denied') {
        // Show after a short delay for better UX
        setTimeout(() => setShowPushPrompt(true), 1500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl('/api/admin/portfolio'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          return;
        }
        throw new Error('Failed to fetch portfolio data');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
      setOriginalData(fetchedData);
      setHasChanges(false);
      setIsRestored(false);
      setHighlightedSections([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataChange = (newData: PortfolioData) => {
    setData(newData);
    setHasChanges(true);
    setIsRestored(false);
    setHighlightedSections([]);
  };

  const getLocalChanges = () => {
    if (!data || !originalData) return [];
    const changes = [];
    if (JSON.stringify(originalData.profile) !== JSON.stringify(data.profile)) changes.push('Profile');
    if (JSON.stringify(originalData.hero) !== JSON.stringify(data.hero)) changes.push('Hero');
    if (JSON.stringify(originalData.about) !== JSON.stringify(data.about)) changes.push('About');
    if (JSON.stringify(originalData.skills) !== JSON.stringify(data.skills)) changes.push('Skills');
    if (JSON.stringify(originalData.experience) !== JSON.stringify(data.experience)) changes.push('Experience');
    if (JSON.stringify(originalData.projects) !== JSON.stringify(data.projects)) changes.push('Projects');
    if (JSON.stringify(originalData.achievements) !== JSON.stringify(data.achievements)) changes.push('Achievements');
    return changes;
  };

  const handleSave = async () => {
    if (!hasChanges || !data) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await fetch(apiUrl('/api/admin/portfolio'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, _isRevert: isRestored }),
      });
      if (!response.ok) {
        if (response.status === 401) return onLogout();
        throw new Error('Failed to save portfolio data');
      }
      setSuccessMsg('Portfolio updated successfully!');
      setOriginalData(data);
      setHasChanges(false);
      setIsRestored(false);
      setHighlightedSections([]);
      setTimeout(() => setSuccessMsg(null), 3000);
      setActiveModal('none'); // Close modal on save
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !data) {
    return <LoadingScreen isReady={false} />;
  }

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <Tooltip />
        {/* Live Portfolio Backgrounds & Globals */}
      <MouseBackground theme={theme} />
      <ScrollProgress />
      <ScrollToTop />
      <FloatingThemeToggle theme={theme} onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <SectionGlowOverlay />

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-2 rounded-full shadow-2xl">
        <button
          onClick={fetchData}
          disabled={isSaving}
          className="p-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
          title="Reload Data"
        >
          <RefreshCw className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setActiveModal('history')}
          disabled={isSaving}
          className="p-3 text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-teal-50 dark:hover:bg-teal-500/10"
          title="Version History"
        >
          <History className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveModal('analytics')}
          disabled={isSaving}
          className="p-3 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10"
          title="Visitor Analytics"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
        
        {hasChanges && (
          <motion.button
            initial={{ opacity: 0, width: 0, padding: 0 }}
            animate={{ opacity: 1, width: 'auto', paddingLeft: 16, paddingRight: 16 }}
            exit={{ opacity: 0, width: 0, padding: 0 }}
            onClick={() => setActiveModal('revert-confirm')}
            disabled={isSaving}
            className="flex items-center gap-2 py-3 text-sm font-bold rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors overflow-hidden whitespace-nowrap"
          >
            <Undo2 className="w-5 h-5" />
            Revert
          </motion.button>
        )}

        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button
          onClick={onLogout}
          className="p-3 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 w-full max-w-md pointer-events-none">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 shadow-lg pointer-events-auto"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 shadow-lg pointer-events-auto"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Portfolio Sections wrapped in EditableSection */}
      <LayoutGroup>
        <EditableSection title="Profile & Hero" onEdit={() => setActiveModal('profile')} isHighlighted={highlightedSections.includes('Profile') || highlightedSections.includes('Hero')}>
          <Hero 
            profile={data.profile}
            hero={data.hero}
            originalProfile={originalData?.profile}
            originalHero={originalData?.hero}
          />  
        </EditableSection>
      </LayoutGroup>     
      
      <div className="portfolio-body-bg relative">
        <Suspense fallback={<div />}>
          <EditableSection title="About" onEdit={() => setActiveModal('about')} isHighlighted={highlightedSections.includes('About')}>
            <About about={data.about} originalAbout={originalData?.about} />
          </EditableSection>
          
          <EditableSection title="Skills & Experience" onEdit={() => setActiveModal('skills')} isHighlighted={highlightedSections.includes('Skills') || highlightedSections.includes('Experience')}>
            <>
              <Skills skills={data.skills} intro={data.skillsIntro} />
              <Experience experience={data.experience} />
            </>
          </EditableSection>

          <EditableSection title="Projects & Awards" onEdit={() => setActiveModal('projects')} isHighlighted={highlightedSections.includes('Projects') || highlightedSections.includes('Achievements')}>
            <>
              <Projects 
                projects={data.projects} 
                intro={data.projectsIntro} 
                originalProjects={originalData?.projects} 
                originalIntro={originalData?.projectsIntro} 
              />
              <Achievements achievements={data.achievements} />
            </>
          </EditableSection>
          <EditableSection title="Resume & Contact" onEdit={() => setActiveModal('about')}>
            <>
              <Resume profile={data.profile} resume={data.resume} />
              <Contact profile={data.profile} contact={data.contact} />
            </>
          </EditableSection>
          
          <Footer />
        </Suspense>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal('none')}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-full flex flex-col bg-slate-50 dark:bg-[#030407] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeModal === 'profile' && 'Edit Profile Settings'}
                  {activeModal === 'about' && 'Edit About & Contact'}
                  {activeModal === 'skills' && 'Edit Skills & Experience'}
                  {activeModal === 'projects' && 'Edit Projects & Achievements'}
                  {activeModal === 'history' && 'Version History'}
                  {activeModal === 'revert-confirm' && 'Discard Unsaved Changes'}
                </h2>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-[#030407]">
                {activeModal === 'profile' && <ProfileHeroEditor data={data} onChange={handleDataChange} />}
                {activeModal === 'about' && <AboutContactEditor data={data} onChange={handleDataChange} />}
                {activeModal === 'skills' && <SkillsExperienceEditor data={data} onChange={handleDataChange} />}
                {activeModal === 'projects' && <ProjectsAchievementsEditor data={data} onChange={handleDataChange} />}
                {activeModal === 'history' && (
                  <HistoryViewer 
                    token={token} 
                    onRestore={(restoredData) => {
                      setData(restoredData);
                      setHasChanges(true);
                      setIsRestored(true);
                      
                      // Calculate which sections changed during this restore
                      const changes = [];
                      if (originalData) {
                        if (JSON.stringify(originalData.profile) !== JSON.stringify(restoredData.profile)) changes.push('Profile');
                        if (JSON.stringify(originalData.hero) !== JSON.stringify(restoredData.hero)) changes.push('Hero');
                        if (JSON.stringify(originalData.about) !== JSON.stringify(restoredData.about)) changes.push('About');
                        if (JSON.stringify(originalData.skills) !== JSON.stringify(restoredData.skills)) changes.push('Skills');
                        if (JSON.stringify(originalData.experience) !== JSON.stringify(restoredData.experience)) changes.push('Experience');
                        if (JSON.stringify(originalData.projects) !== JSON.stringify(restoredData.projects)) changes.push('Projects');
                        if (JSON.stringify(originalData.achievements) !== JSON.stringify(restoredData.achievements)) changes.push('Achievements');
                      }
                      setHighlightedSections(changes);
                      setActiveModal('none');
                    }}
                    onClose={() => setActiveModal('none')}
                  />
                )}
                {activeModal === 'revert-confirm' && (
                  <div className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                      <Undo2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Are you sure you want to revert?</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                        This will permanently discard your local, unsaved edits. The following sections will lose their changes:
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        {getLocalChanges().length > 0 ? (
                          getLocalChanges().map((change, idx) => (
                            <span key={idx} className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-semibold rounded-md border border-amber-200 dark:border-amber-500/30 shadow-sm">
                              {change}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">No major changes detected.</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-4">
                      <button
                        onClick={() => setActiveModal('none')}
                        className="px-6 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        Keep Editing
                      </button>
                      <button
                        onClick={() => {
                          fetchData();
                          setActiveModal('none');
                        }}
                        className="px-6 py-2 font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md shadow-red-500/20"
                      >
                        Yes, Discard Edits
                      </button>
                    </div>
                  </div>
                )}
                {activeModal === 'analytics' && (
                  <AnalyticsViewer 
                    token={token} 
                    onClose={() => setActiveModal('none')} 
                  />
                )}
              </div>
              
              {(activeModal !== 'history' && activeModal !== 'revert-confirm' && activeModal !== 'analytics') && (
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md flex justify-end gap-3">
                  <button
                    onClick={() => setActiveModal('none')}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save & Close'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPushPrompt && (
          <PushNotificationPrompt 
            token={token} 
            onComplete={() => setShowPushPrompt(false)} 
          />
        )}
      </AnimatePresence>
    </div>
    </TooltipProvider>
  );
}
