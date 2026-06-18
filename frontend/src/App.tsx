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
import { TooltipProvider } from './components/TooltipContext';
import Tooltip from './components/Tooltip';
import CustomCursor from './components/CustomCursor';

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
  const [showPage, setShowPage] = useState(false);
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

  // Notify backend of site visit
  useEffect(() => {
    // Fire and forget visit notification
    fetch(apiUrl('/api/notify/visit'), { method: 'POST' }).catch(() => {});

    // Global error listeners for email notification
    const handleError = (event: ErrorEvent) => {
      fetch(apiUrl('/api/notify/error'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'Window Error',
          error: event.error?.stack || event.message
        })
      }).catch(() => {});
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      fetch(apiUrl('/api/notify/error'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'Unhandled Promise Rejection',
          error: event.reason?.stack || String(event.reason)
        })
      }).catch(() => {});
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  useEffect(() => {
    if (isBackgroundDemo || isResumeView || isDownloadResume) {
      return;
    }

    const loadPortfolio = async () => {
      try {

        const response = await fetch(apiUrl('/api/portfolio'));

        if (!response.ok) {
          throw new Error('API failed');
        }

        const data = (await response.json()) as PortfolioData;

        setPortfolio(data);

      } catch (loadError) {

        console.error('Main API failed:', loadError);

        try {

          const fallbackResponse = await fetch('/fallbackPortfolio.json');

          if (!fallbackResponse.ok) {
            throw new Error('Fallback failed');
          }

          const fallbackData =
            (await fallbackResponse.json()) as PortfolioData;

          setPortfolio(fallbackData);

        } catch (fallbackError) {

          console.error('Fallback failed:', fallbackError);

          setError('Unable to load portfolio.');
        }
      }
    };
    loadPortfolio();
  }, [isBackgroundDemo, isResumeView, isDownloadResume]);

  useEffect(() => {
    if (portfolio) {
      const timer = setTimeout(() => {
        setShowPage(true);
      }, 1500); // Increased to 1.5s for smoother transition and reading the success message
      return () => clearTimeout(timer);
    }
  }, [portfolio]);

  if (isBackgroundDemo) {
    return <BackgroundDemo />;
  }

  if (isResumeView) {
    return (
      <>
        <CustomCursor />
        <ResumeViewer />
      </>
    );
  }

  if (isDownloadResume) {
    return (
      <>
        <CustomCursor />
        <DownloadResume />
      </>
    );
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

  if (!showPage) {
    return (
      <AnimatePresence mode="wait">
        <LoadingScreen isReady={!!portfolio} />
      </AnimatePresence>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <TooltipProvider>
      <CustomCursor />
      <motion.main
        className="relative min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900 dark:bg-[#06070b] dark:text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tooltip />
        <MouseBackground theme={theme} />
        <Header />
        <ScrollProgress />
        <ScrollToTop />
        <FloatingThemeToggle theme={theme} onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))} />
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
    </TooltipProvider>
  );
}

export default App;
