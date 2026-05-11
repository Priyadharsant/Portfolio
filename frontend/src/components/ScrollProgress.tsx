import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 28,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;
