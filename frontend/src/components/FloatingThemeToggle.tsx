import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

type FloatingThemeToggleProps = {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
};

const FloatingThemeToggle = ({ theme, onThemeToggle }: FloatingThemeToggleProps) => {
    const isDark = theme === 'dark';

    return (
        <motion.button
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200/50 bg-white/50 text-zinc-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500/50 hover:bg-white/80 hover:text-teal-700 hover:shadow-[0_20px_50px_rgba(20,184,166,0.25)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] active:translate-y-0 dark:border-white/5 dark:bg-zinc-950/80 dark:text-zinc-200 dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] dark:hover:border-teal-400/40 dark:hover:bg-zinc-900 dark:hover:text-teal-300 dark:hover:shadow-[0_20_50px_rgba(45,212,191,0.2)] dark:focus:ring-teal-300 dark:focus:ring-offset-[#06070b]"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.25 }}
            onClick={onThemeToggle}
            whileTap={{ scale: 0.92 }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ rotate: -45, opacity: 0, scale: 0.75 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 45, opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.18 }}
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
};

export default FloatingThemeToggle;
