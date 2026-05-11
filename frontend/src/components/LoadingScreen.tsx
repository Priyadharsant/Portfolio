import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06070b] px-5">
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.05),transparent_50%)]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <div className="relative flex flex-col items-center">
                {/* Modern Spinning Rings */}
                <div className="relative h-24 w-24 mb-10">
                    <motion.div
                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-teal-400/80"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500/80"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full border-t-2 border-l-2 border-cyan-300/80"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span 
                            className="text-sm font-black text-white tracking-widest"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            PT
                        </motion.span>
                    </div>
                </div>

                {/* Text Animation */}
                <div className="text-center">
                    <motion.h2
                        className="text-sm font-bold text-teal-300 tracking-[0.3em] uppercase mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Loading...
                    </motion.h2>                    <div className="flex gap-2 justify-center">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                animate={{ 
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoadingScreen;
