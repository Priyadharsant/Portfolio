import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import DiffHighlight from './admin/DiffHighlight';
import { SMOOTH_EASE, scrollRevealBadge } from '../utils/motion';

type SectionHeaderProps = {
    kicker: string;
    title: string;
    copy?: string;
    originalTitle?: string;
    originalCopy?: string;
    align?: 'left' | 'center';
};

const SectionHeader = ({ kicker, title, copy, originalTitle, originalCopy, align = 'left' }: SectionHeaderProps) => {
    const isCentered = align === 'center';
    const titleWords = typeof title === 'string' ? title.split(' ') : [title];

    return (
        <motion.div
            className={isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
        >
            <motion.div
                className="inline-flex items-center justify-center rounded-full bg-teal-50/90 px-4 py-1.5 mb-4 border border-teal-500/20 dark:bg-teal-500/10"
                variants={scrollRevealBadge}
            >
                <Sparkles className="mr-2 h-4 w-4 text-teal-700 dark:text-teal-400" />
                <span className="text-sm font-semibold text-teal-700 uppercase tracking-widest dark:text-teal-300">{kicker}</span>
            </motion.div>
            <div className={isCentered ? 'mx-auto flex max-w-2xl flex-col items-center' : 'flex max-w-2xl flex-col'}>
                <h2 className="section-title overflow-hidden pb-1">
                    <DiffHighlight current={title} original={originalTitle}>
                        {titleWords.map((word, index) => (
                            <motion.span
                                key={`${word}-${index}`}
                                className="mr-2 inline-block"
                                variants={{
                                    hidden: { opacity: 0, y: 24, rotateX: -20 },
                                    visible: { opacity: 1, y: 0, rotateX: 0 },
                                }}
                                transition={{ duration: 0.65, ease: SMOOTH_EASE }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </DiffHighlight>
                </h2>
                <motion.div
                    className="mt-4 h-0.5 w-24 origin-left bg-gradient-to-r from-teal-300 via-cyan-300 to-transparent"
                    variants={{
                        hidden: { scaleX: 0, opacity: 0 },
                        visible: { scaleX: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.75, ease: SMOOTH_EASE, delay: 0.15 }}
                />
            </div>
            {copy && (
                <motion.p
                    className={isCentered ? 'mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300' : 'section-copy'}
                    variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, ease: SMOOTH_EASE, delay: 0.2 }}
                >
                    <DiffHighlight current={copy} original={originalCopy}>
                        {copy}
                    </DiffHighlight>
                </motion.p>
            )}
        </motion.div>
    );
};

export default SectionHeader;
