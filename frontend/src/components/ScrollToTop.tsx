import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

const ScrollToTop = () => {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsVisible(latest > 400);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    type="button"
                    aria-label="Scroll to top"
                    title="Scroll to top"
                    className="fixed bottom-[4.25rem] sm:bottom-20 right-4 sm:right-6 z-50 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-zinc-200/50 bg-white/70 text-zinc-700 shadow-[0_6px_25px_rgb(0,0,0,0.1)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:bg-white hover:text-teal-700 hover:shadow-[0_15px_35px_rgba(20,184,166,0.2)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] active:translate-y-0 dark:border-white/5 dark:bg-zinc-950/80 dark:text-zinc-200 dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] dark:hover:border-teal-400/40 dark:hover:bg-zinc-900 dark:hover:text-teal-300 dark:hover:shadow-[0_20px_50px_rgba(45,212,191,0.2)] dark:focus:ring-teal-300 dark:focus:ring-offset-[#06070b]"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={scrollToTop}
                >
                    <ArrowUp className="h-4 w-4" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;