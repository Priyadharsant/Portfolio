import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundDemo from './components/BackgroundDemo';
import ResumeViewer from './components/ResumeViewer';
import DownloadResume from './components/DownloadResume';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import Logo from './components/Logo';
import type { PortfolioData } from './types/portfolio';
import { apiUrl } from './utils/api';

function App() {
  const isBackgroundDemo = window.location.pathname === '/background-demo';
  const isResumeView = window.location.pathname === '/resume';
  const isDownloadResume = window.location.pathname === '/download_resume';
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [error, setError] = useState('');
  const [isFloatingLogoVisible, setIsFloatingLogoVisible] = useState(false);

  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const isFloatingLogoVisibleRef = useRef(false);

  useEffect(() => {
    const updateFloatingLogo = () => {
      const shouldShowLogo = window.scrollY > window.innerHeight * 0.72;

      if (shouldShowLogo !== isFloatingLogoVisibleRef.current) {
        isFloatingLogoVisibleRef.current = shouldShowLogo;
        setIsFloatingLogoVisible(shouldShowLogo);
      }
    };

    updateFloatingLogo();
    window.addEventListener('scroll', updateFloatingLogo, { passive: true });
    window.addEventListener('resize', updateFloatingLogo);

    return () => {
      window.removeEventListener('scroll', updateFloatingLogo);
      window.removeEventListener('resize', updateFloatingLogo);
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
      <main className="flex min-h-screen items-center justify-center bg-[#06070b] px-5 text-center text-slate-100">
        <div className="glass-panel max-w-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white">Portfolio backend is offline</h1>
          <p className="mt-3 text-slate-300">{error}</p>
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
    <motion.div
      className="min-h-screen overflow-hidden bg-[#06070b] text-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ScrollProgress />
      <LayoutGroup>
        <Logo isHidden={!isFloatingLogoVisible} />
        <Hero profile={portfolio.profile} hero={portfolio.hero} nameRef={heroNameRef} />
      </LayoutGroup>
      <div className="portfolio-body-bg">
        <About about={portfolio.about} />
        <Skills skills={portfolio.skills} intro={portfolio.skillsIntro} />
        <Experience experience={portfolio.experience} />
        <Projects projects={portfolio.projects} intro={portfolio.projectsIntro} />
        <Achievements achievements={portfolio.achievements} />
        <Resume profile={portfolio.profile} resume={portfolio.resume} />
        <Contact profile={portfolio.profile} contact={portfolio.contact} />
        <Footer footer={portfolio.footer} />
      </div>
    </motion.div>
  );
}

export default App;
