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
            className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/90 bg-white/80 text-slate-700 shadow-2xl shadow-slate-300/60 backdrop-blur-xl transition hover:-translate-y-1 hover:border-teal-500/70 hover:bg-white hover:text-teal-700 hover:shadow-teal-200/70 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] active:translate-y-0 dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-200 dark:shadow-black/30 dark:hover:border-teal-300/60 dark:hover:bg-slate-900 dark:hover:text-teal-200 dark:hover:shadow-teal-950/40 dark:focus:ring-teal-300 dark:focus:ring-offset-[#06070b]"
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
