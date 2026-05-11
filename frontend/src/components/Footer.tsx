import { motion } from 'framer-motion';
import type { PortfolioData } from '../types/portfolio';

type FooterProps = {
    footer: PortfolioData['footer'];
};

const Footer = ({ footer }: FooterProps) => {
    return (
        <footer className="bg-[#06070b] py-8 text-slate-400">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row sm:px-6 lg:px-8">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {footer.builtWith}
                </motion.p>
                <p>{footer.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
