import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

type MouseBackgroundProps = {
    theme: 'light' | 'dark';
};

const MouseBackground = ({ theme }: MouseBackgroundProps) => {
    const pointerX = useMotionValue(-500);
    const pointerY = useMotionValue(-500);
    const [isVisible, setIsVisible] = useState(false);
    const isDark = theme === 'dark';

    const lightBackground = useMotionTemplate`
        radial-gradient(420px circle at ${pointerX}px ${pointerY}px, rgba(20, 184, 166, 0.2), transparent 45%),
        radial-gradient(260px circle at ${pointerX}px ${pointerY}px, rgba(14, 165, 233, 0.14), transparent 60%)
    `;
    const darkBackground = useMotionTemplate`
        radial-gradient(340px circle at ${pointerX}px ${pointerY}px, rgba(45, 212, 191, 0.09), transparent 48%),
        radial-gradient(220px circle at ${pointerX}px ${pointerY}px, rgba(56, 189, 248, 0.055), transparent 64%)
    `;

    useEffect(() => {
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (!canHover) {
            return;
        }

        const updatePointer = (event: PointerEvent) => {
            pointerX.set(event.clientX);
            pointerY.set(event.clientY);
            setIsVisible(true);
        };

        const hidePointer = () => setIsVisible(false);

        window.addEventListener('pointermove', updatePointer, { passive: true });
        document.documentElement.addEventListener('mouseleave', hidePointer);

        return () => {
            window.removeEventListener('pointermove', updatePointer);
            document.documentElement.removeEventListener('mouseleave', hidePointer);
        };
    }, [pointerX, pointerY]);

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[1] hidden opacity-0 mix-blend-multiply dark:mix-blend-screen md:block"
            style={{ background: isDark ? darkBackground : lightBackground }}
            animate={{ opacity: isVisible ? isDark ? 0.72 : 1 : 0 }}
            transition={{ duration: 0.12, ease: 'linear' }}
        />
    );
};

export default MouseBackground;
