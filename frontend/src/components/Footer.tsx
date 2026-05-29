import { ArrowUp } from 'lucide-react';
import type { PortfolioData } from '../types/portfolio';

type FooterProps = {
    footer: PortfolioData['footer'];
};

const Footer = ({ footer }: FooterProps) => {
    return (
        <footer className="bg-transparent py-8 text-slate-600 dark:text-slate-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-200/80 px-4 pt-8 text-center text-sm dark:border-white/10 sm:flex-row sm:px-5 lg:px-6 xl:px-8">
                <p className="text-slate-700 dark:text-slate-300">{footer.copyright}</p>
                <a
                    href="#"
                    aria-label="Back to top"
                    title="Back to top"
                    className="secondary-action h-10 w-10 px-0 py-0"
                >
                    <ArrowUp className="h-4 w-4" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
