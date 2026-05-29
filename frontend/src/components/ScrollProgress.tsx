import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400"
            style={{ scaleX: scrollYProgress }}
        />
    );
};

export default ScrollProgress;
