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
        radial-gradient(320px circle at ${pointerX}px ${pointerY}px, rgba(20, 184, 166, 0.08), transparent 50%),
        radial-gradient(180px circle at ${pointerX}px ${pointerY}px, rgba(14, 165, 233, 0.05), transparent 65%)
    `;
    const darkBackground = useMotionTemplate`
        radial-gradient(280px circle at ${pointerX}px ${pointerY}px, rgba(45, 212, 191, 0.045), transparent 50%),
        radial-gradient(160px circle at ${pointerX}px ${pointerY}px, rgba(56, 189, 248, 0.025), transparent 65%)
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
            animate={{ opacity: isVisible ? (isDark ? 0.45 : 0.65) : 0 }}
            transition={{ duration: 0.12, ease: 'linear' }}
        />
    );
};

export default MouseBackground;
