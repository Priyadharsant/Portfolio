import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import type { PortfolioData } from './types/portfolio';

function App() {
  const isBackgroundDemo = window.location.pathname === '/background-demo';
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isBackgroundDemo) {
      return;
    }

    const loadPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');

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
  }, [isBackgroundDemo]);

  if (isBackgroundDemo) {
    return <BackgroundDemo />;
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
      <Hero profile={portfolio.profile} hero={portfolio.hero} />
      <About about={portfolio.about} />
      <Skills skills={portfolio.skills} intro={portfolio.skillsIntro} />
      <Experience experience={portfolio.experience} />
      <Projects projects={portfolio.projects} intro={portfolio.projectsIntro} />
      <Achievements achievements={portfolio.achievements} />
      <Resume profile={portfolio.profile} resume={portfolio.resume} />
      <Contact profile={portfolio.profile} contact={portfolio.contact} />
      <Footer footer={portfolio.footer} />
    </motion.div>
  );
}

export default App;
