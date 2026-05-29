import { AnimatePresence, motion } from 'framer-motion';

const Logo = ({ isHidden = false }: { isHidden?: boolean }) => {
    return (
        <motion.div
            className="fixed left-6 top-6 z-50 flex cursor-pointer items-center gap-3 rounded-full border border-slate-200/90 bg-white/80 px-3 py-2 shadow-2xl shadow-slate-200/70 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/30"
            initial={false}
            animate={{
                pointerEvents: isHidden ? 'none' : 'auto',
                opacity: isHidden ? 0 : 1,
                scale: isHidden ? 0.98 : 1,
                y: isHidden ? -10 : 0,
                visibility: isHidden ? 'hidden' : 'visible',
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            whileHover={!isHidden ? { y: -2, borderColor: 'rgba(45, 212, 191, 0.35)' } : {}}
            whileTap={!isHidden ? { scale: 0.95 } : {}}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <motion.div
                className="relative flex h-10 w-10 items-center justify-center"
                initial={false}
                animate={{
                    opacity: isHidden ? 0 : 1,
                    scale: isHidden ? 0.8 : 1,
                    y: isHidden ? 18 : 0
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]"
                >
                    <path
                        d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z"
                        stroke="url(#paint0_linear)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M20 15V29M20 15L27 20M20 15L13 20"
                        stroke="url(#paint1_linear)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient
                            id="paint0_linear"
                            x1="20"
                            y1="2"
                            x2="20"
                            y2="38"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#2DD4BF" />
                            <stop offset="1" stopColor="#06B6D4" />
                        </linearGradient>
                        <linearGradient
                            id="paint1_linear"
                            x1="20"
                            y1="15"
                            x2="20"
                            y2="29"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#2DD4BF" />
                            <stop offset="1" stopColor="#06B6D4" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>
            <AnimatePresence mode="wait">
                {!isHidden && (
                    <motion.span
                        key="hero-name"
                        className="hidden text-xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:block whitespace-nowrap"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        style={{ perspective: "1000px" }}
                    >
                        Priya<span className="text-teal-400">dharsan</span>
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Logo;
