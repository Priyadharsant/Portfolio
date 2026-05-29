const Footer = () => {
    return (
        <footer className="bg-transparent py-12 text-slate-600 dark:text-slate-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-sm sm:flex-row sm:px-5 lg:px-6 xl:px-8">
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                    © 2026 Priyadharsan T. All rights reserved.
                </p>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Designed and Developed by</span>
                    <p className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                        Priya<span className="text-teal-500">Dharsan T</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
