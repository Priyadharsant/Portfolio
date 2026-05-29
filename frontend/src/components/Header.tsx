import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Expertise', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

const Header = () => {
    const { scrollY } = useScroll();
    const headerRef = useRef<HTMLElement | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 60);
        if (latest > 0 && isMenuOpen) {
            setIsMenuOpen(false);
        }
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!isMenuOpen || !headerRef.current) {
                return;
            }

            const target = event.target as Node | null;
            if (target && !headerRef.current.contains(target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <motion.header ref={headerRef}
            className="fixed inset-x-0 top-0 z-50"
            initial={{ y: -100, opacity: 0 }}
            animate={isScrolled || isMenuOpen ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className={`overflow-hidden border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${isScrolled || isMenuOpen
                    ? 'border-zinc-200/50 bg-white/20 backdrop-blur-2xl dark:border-white/5 dark:bg-zinc-950/40' // Scrolled state: neutral dark blur effect
                    : 'border-transparent bg-transparent dark:bg-transparent' // Initial state: transparent background and border
                    }`}
                animate={{
                    boxShadow: isScrolled
                        ? '0 12px 34px rgba(0, 0, 0, 0.15)'
                        : '0 0 0 rgba(0, 0, 0, 0)',
                }}
                transition={{ duration: 0.22 }}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5 lg:px-6 xl:px-8">
                    <a
                        href="#"
                        onClick={closeMenu}
                        className="group flex min-w-0 items-center rounded-md px-2 py-1.5 text-slate-950 outline-none transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-100"
                        aria-label="Back to top"
                    >
                        <span className="relative min-w-0 truncate text-lg font-black tracking-tight sm:text-xl">
                            <span className="text-slate-950 transition-colors group-hover:text-slate-800 dark:text-white dark:group-hover:text-slate-100">
                                Priya
                            </span>
                            <span className="text-teal-600 transition-colors group-hover:text-cyan-600 dark:text-teal-400 dark:group-hover:text-cyan-300">
                                Dharsan T
                            </span>
                            <span className="absolute -bottom-1.5 left-0 h-0.5 w-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-200 group-hover:w-full" />
                        </span>
                    </a>

                    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="relative rounded-full px-3 py-2 text-sm font-bold text-slate-600 transition duration-200 after:absolute after:bottom-1.5 after:left-3 after:right-3 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-teal-500 after:transition-transform after:duration-200 hover:-translate-y-0.5 hover:text-slate-950 hover:after:scale-x-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:after:bg-teal-300 dark:hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <motion.a
                            href="/resume"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden h-10 items-center gap-2 rounded-md bg-teal-600 px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-200/60 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 dark:hover:shadow-teal-950/40 dark:focus:ring-teal-300 dark:focus:ring-offset-[#06070b] md:inline-flex"
                            whileHover={{ y: -3, scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <Eye className="h-4 w-4" />
                            View Resume
                        </motion.a>

                        <motion.button
                            type="button"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200/80 bg-white/60 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-teal-500/70 hover:bg-white/90 hover:text-teal-700 hover:shadow-lg hover:shadow-teal-100/70 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#f8fbff] active:translate-y-0 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-teal-300/50 dark:hover:bg-white/10 dark:hover:text-teal-200 dark:hover:shadow-teal-950/30 dark:focus:ring-teal-300 dark:focus:ring-offset-[#06070b] lg:hidden"
                            onClick={() => setIsMenuOpen((current) => !current)}
                            whileTap={{ scale: 0.94 }}
                        >
                            <div className="relative h-5 w-5">
                                <motion.span
                                    className="absolute left-0 top-1 h-0.5 w-5 bg-current rounded-full"
                                    animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.span
                                    className="absolute left-0 top-2.5 h-0.5 w-5 bg-current rounded-full"
                                    animate={isMenuOpen ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.span
                                    className="absolute left-0 top-4 h-0.5 w-5 bg-current rounded-full"
                                    animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isMenuOpen && (
                        <motion.div
                            className="border-t border-slate-200/70 bg-white/50 backdrop-blur-3xl px-4 pb-4 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-[#06070b]/85 dark:backdrop-blur-3xl lg:hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                            <nav className="grid gap-1 pt-3" aria-label="Mobile navigation">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition duration-200 hover:bg-teal-100/90 hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-teal-200"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                                <a
                                    href="/resume"
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={closeMenu}
                                    className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal-600 px-4 text-sm font-bold text-white transition hover:bg-teal-700 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 md:hidden"
                                >
                                    <Eye className="h-4 w-4" />
                                    View Resume
                                </a>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.header>
    );
};

export default Header;
