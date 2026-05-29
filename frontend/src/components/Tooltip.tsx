import { motion, AnimatePresence } from 'framer-motion';
import { useTooltip } from './TooltipContext';

const Tooltip = () => {
    const { tooltip } = useTooltip();
    const yOffset = 8;

    return (
        <AnimatePresence>
            {tooltip.visible && (
                <motion.div
                    className="pointer-events-none fixed z-[100] rounded-md border border-slate-200/80 bg-white/80 px-3 py-1.5 text-sm font-semibold text-teal-700 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/80 dark:text-teal-300"
                    style={{
                        left: tooltip.position.x,
                        top: tooltip.position.y,
                        translateX: '-50%',
                        translateY: tooltip.placement === 'top' ? `calc(-100% - ${yOffset}px)` : `${yOffset}px`,
                    }}
                    initial={{ opacity: 0, scale: 0.9, y: tooltip.placement === 'top' ? 5 : -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: tooltip.placement === 'top' ? 5 : -5 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                    {tooltip.content}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Tooltip;