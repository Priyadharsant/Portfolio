import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const glowPresets = [
    { color: 'rgba(20, 184, 166, 0.14)', point: '22% 26%' },
    { color: 'rgba(56, 189, 248, 0.13)', point: '78% 22%' },
    { color: 'rgba(253, 224, 71, 0.12)', point: '18% 72%' },
    { color: 'rgba(168, 85, 247, 0.12)', point: '80% 72%' },
    { color: 'rgba(34, 211, 238, 0.12)', point: '24% 32%' },
    { color: 'rgba(52, 211, 153, 0.14)', point: '76% 30%' },
    { color: 'rgba(234, 179, 8, 0.12)', point: '50% 80%' },
];

const SectionGlowOverlay = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        const sections = Array.from(document.querySelectorAll('.portfolio-body-bg > section'));
        if (!sections.length) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.15);
                if (!visibleEntries.length) {
                    return;
                }

                visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                const section = visibleEntries[0].target as HTMLElement;
                const index = sections.indexOf(section);

                setActiveIndex(index < 0 ? null : index);
            },
            { threshold: [0.15, 0.3, 0.5, 0.75] },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    if (activeIndex === null) {
        return null;
    }

    const glow = glowPresets[activeIndex % glowPresets.length];

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
                background: `radial-gradient(circle at ${glow.point}, ${glow.color} 0%, transparent 35%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 62%)`,
                mixBlendMode: 'screen',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        />
    );
};

export default SectionGlowOverlay;
