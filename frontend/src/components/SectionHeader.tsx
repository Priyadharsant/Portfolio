import { motion } from 'framer-motion';

type SectionHeaderProps = {
    kicker: string;
    title: string;
    copy?: string;
    align?: 'left' | 'center';
};

const SectionHeader = ({ kicker, title, copy, align = 'left' }: SectionHeaderProps) => {
    const isCentered = align === 'center';
    const titleWords = title.split(' ');

    return (
        <motion.div
            className={isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
        >
            <motion.p
                className="section-kicker"
                variants={{
                    hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
            >
                {kicker}
            </motion.p>
            <div className={isCentered ? 'mx-auto flex max-w-2xl flex-col items-center' : 'flex max-w-2xl flex-col'}>
                <h2 className="section-title overflow-hidden pb-1">
                    {titleWords.map((word, index) => (
                        <motion.span
                            key={`${word}-${index}`}
                            className="mr-2 inline-block"
                            variants={{
                                hidden: { opacity: 0, y: 34, rotateX: -35 },
                                visible: { opacity: 1, y: 0, rotateX: 0 },
                            }}
                            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </h2>
                <motion.div
                    className="mt-4 h-px w-24 origin-left bg-gradient-to-r from-teal-300 via-cyan-300 to-transparent"
                    variants={{
                        hidden: { scaleX: 0, opacity: 0 },
                        visible: { scaleX: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
                />
            </div>
            {copy && (
                <motion.p
                    className={isCentered ? 'mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300' : 'section-copy'}
                    variants={{
                        hidden: { opacity: 0, y: 18 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.55, ease: 'easeOut', delay: 0.16 }}
                >
                    {copy}
                </motion.p>
            )}
        </motion.div>
    );
};

export default SectionHeader;
