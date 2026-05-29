import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Hero from './components/Hero';
import BackgroundDemo from './components/BackgroundDemo';
import ResumeViewer from './components/ResumeViewer';
import DownloadResume from './components/DownloadResume';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import MouseBackground from './components/MouseBackground';
import FloatingThemeToggle from './components/FloatingThemeToggle';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import SectionGlowOverlay from './components/SectionGlowOverlay';
import type { PortfolioData } from './types/portfolio';
import { apiUrl } from './utils/api';

const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Achievements = lazy(() => import('./components/Achievements'));
const Resume = lazy(() => import('./components/Resume'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const isBackgroundDemo = window.location.pathname === '/background-demo';
  const isResumeView = window.location.pathname === '/resume';
  const isDownloadResume = window.location.pathname === '/download_resume';
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isBackgroundDemo || isResumeView || isDownloadResume) {
      return;
    }

    const loadPortfolio = async () => {
      try {
        const response = await fetch(apiUrl('/api/portfolio'));

        if (!response.ok) {
          throw new Error('Unable to load portfolio details.');
        }

        const data = (await response.json()) as PortfolioData;
        setPortfolio(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load portfolio details.',
        );
      }
    };

    loadPortfolio();
  }, [isBackgroundDemo, isResumeView, isDownloadResume]);

  if (isBackgroundDemo) {
    return <BackgroundDemo />;
  }

  if (isResumeView) {
    return <ResumeViewer />;
  }

  if (isDownloadResume) {
    return <DownloadResume />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-5 text-center text-slate-900 dark:bg-[#06070b] dark:text-slate-100">
        <div className="glass-panel max-w-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Portfolio backend is offline</h1>
          <p className="mt-3 text-slate-700 dark:text-slate-300">{error}</p>
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <AnimatePresence mode="wait">
        <LoadingScreen />
      </AnimatePresence>
    );
  }

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900 dark:bg-[#06070b] dark:text-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MouseBackground theme={theme} />
      <Header />
      <ScrollProgress />
      <ScrollToTop />
      <FloatingThemeToggle theme={theme} onThemeToggle={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')} />
      <SectionGlowOverlay />
      <LayoutGroup>
        <Hero profile={portfolio.profile} hero={portfolio.hero} />
      </LayoutGroup>
      <div className="portfolio-body-bg relative">
        <Suspense fallback={<LoadingScreen />}>
          <About about={portfolio.about} />
          <Skills skills={portfolio.skills} intro={portfolio.skillsIntro} />
          <Experience experience={portfolio.experience} />
          <Projects projects={portfolio.projects} intro={portfolio.projectsIntro} />
          <Achievements achievements={portfolio.achievements} />
          <Resume profile={portfolio.profile} resume={portfolio.resume} />
          <Contact profile={portfolio.profile} contact={portfolio.contact} />
          <Footer />
        </Suspense>
      </div>
    </motion.main>
  );
}

export default App;
