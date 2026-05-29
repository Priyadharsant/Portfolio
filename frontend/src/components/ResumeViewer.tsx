import { ArrowLeft, Download, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { apiUrl } from '../utils/api';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const ResumeViewer = () => {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1); // react-pdf uses a scale factor

    useEffect(() => {
        document.title = 'Resume | Priyadharsan T';

        let objectUrl: string | null = null;

        const loadResume = async () => {
            try {
                const response = await fetch(apiUrl('/api/resume'));
                if (!response.ok) throw new Error('Failed to load resume');
                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                setResumeUrl(objectUrl);
            } catch (error) {
                console.error('Error loading resume:', error);
            }
        };

        loadResume();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }) => {
        setNumPages(nextNumPages);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleZoomIn = () => {
        setZoom((prevZoom) => Math.min(2.5, prevZoom + 0.2));
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(0.5, prevZoom - 0.2));
    };

    return (
        <main className="relative h-screen bg-[#06070b] text-slate-100">
            <style>{`
                @media print {
                    body {
                        background-color: white;
                    }
                    header, .print-hidden {
                        display: none;
                    }
                    .pdf-container {
                        padding-top: 0;
                        height: auto;
                        overflow: visible;
                    }
                    .react-pdf__Page {
                        margin-bottom: 1rem;
                        box-shadow: none;
                    }
                }

                .pdf-container {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(45, 212, 191, 0.4) transparent;
                }

                .pdf-container::-webkit-scrollbar {
                    width: 14px;
                }

                .pdf-container::-webkit-scrollbar-track {
                    background: transparent;
                }

                .pdf-container::-webkit-scrollbar-thumb {
                    background-color: rgba(45, 212, 191, 0.25);
                    border-radius: 10px;
                    border: 3px solid transparent;
                    background-clip: content-box;
                }
                .pdf-container::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(45, 212, 191, 0.4);
                }
            `}</style>
            <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/40 px-4 backdrop-blur-md sm:px-5 lg:px-6 xl:px-8">
                <a
                    href="/"
                    className="group flex min-w-0 items-center rounded-md px-2 py-1.5 text-slate-100 outline-none transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-teal-500"
                    aria-label="Back to portfolio"
                >
                    <ArrowLeft className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span className="relative min-w-0 truncate text-lg font-black tracking-tight sm:text-xl">
                        <span className="text-white transition-colors group-hover:text-slate-100">
                            Priya
                        </span>
                        <span className="text-teal-400 transition-colors group-hover:text-cyan-300">
                            dharsan T
                        </span>
                    </span>
                </a>
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-1 rounded-md bg-slate-950/95 text-white dark:bg-teal-400 dark:text-slate-950 sm:inline-flex">
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            className="h-10 w-10 inline-flex items-center justify-center rounded-l-md transition hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b] dark:hover:bg-teal-300"
                            aria-label="Zoom out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="w-px h-5 bg-white/20 dark:bg-slate-950/20" />
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            className="h-10 w-10 inline-flex items-center justify-center rounded-r-md transition hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b] dark:hover:bg-teal-300"
                            aria-label="Zoom in"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </div>
                    <a
                        href="/download_resume"
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950/95 px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </a>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="hidden h-10 items-center gap-2 rounded-md bg-slate-950/95 px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 sm:inline-flex"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>
                </div>
            </header>
            <div className="h-full pt-16 overflow-auto pdf-container">
                {resumeUrl ? (
                    <Document
                        file={resumeUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="flex h-full items-center justify-center"><p className="text-slate-400">Loading Resume...</p></div>}
                        className="flex flex-col items-center gap-8 py-8"
                    >
                        {Array.from({ length: numPages ?? 0 }, (_, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                scale={zoom}
                                className="shadow-2xl shadow-black/40"
                            />
                        ))}
                    </Document>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-slate-400">Loading Resume...</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ResumeViewer;
