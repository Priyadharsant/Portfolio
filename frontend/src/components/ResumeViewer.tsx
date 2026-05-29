import { ArrowLeft, Download, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);

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

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
        if (containerRef.current) {
            pdf.getPage(1).then((page: any) => {
                const isMobile = window.innerWidth < 768;
                const style = window.getComputedStyle(containerRef.current!);
                const containerWidth =
                    containerRef.current!.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                const scaleToFit = containerWidth / page.getViewport({ scale: 1.0 }).width;
                if (isMobile) {
                    setZoom(scaleToFit);
                } else {
                    setZoom(Math.min(1.0, scaleToFit));
                }
            });
        }
    };

    const handlePrint = () => {
        if (!resumeUrl) return;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = resumeUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
            const iframeWindow = iframe.contentWindow;
            if (iframeWindow) {
                const handleAfterPrint = () => {
                    iframeWindow.removeEventListener('afterprint', handleAfterPrint);
                    document.body.removeChild(iframe);
                };
                iframeWindow.addEventListener('afterprint', handleAfterPrint);
                iframeWindow.print();
            }
        }
    };

    const handleZoomIn = () => {
        setZoom((prevZoom) => Math.min(2.5, prevZoom + 0.2));
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(0.5, prevZoom - 0.2));
    };

    return (
        <main className="dark relative min-h-screen bg-[#06070b] text-slate-100">
            <style>{`
                @media print {
                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }

                    body * {
                        visibility: hidden;
                    }

                    .pdf-container, .pdf-container * {
                        visibility: visible;
                    }

                    .pdf-container {
                        position: absolute;
                        inset: 0;
                        overflow: visible !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }

                    .react-pdf__Document {
                        display: block !important;
                    }

                    .react-pdf__Page {
                        margin: 0 auto !important;
                        box-shadow: none !important;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .react-pdf__Page canvas {
                        width: 100% !important;
                        height: auto !important;
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
                    <div className="hidden items-center gap-1 rounded-md bg-teal-400 text-slate-950 sm:inline-flex">
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            className="h-10 w-10 inline-flex items-center justify-center rounded-l-md bg-inherit transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b]"
                            aria-label="Zoom out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="w-px h-5 bg-slate-950/20" />
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            className="h-10 w-10 inline-flex items-center justify-center rounded-r-md bg-inherit transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b]"
                            aria-label="Zoom in"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </div>
                    <a
                        href="/download_resume"
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-400 px-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b]"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </a>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="hidden h-10 items-center gap-2 rounded-md bg-teal-400 px-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#06070b] sm:inline-flex"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>
                </div>
            </header>
            <div ref={containerRef} className="h-full pt-16 overflow-auto pdf-container px-4 print:p-0">
                {resumeUrl ? (
                    <Document
                        file={resumeUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="flex h-full items-center justify-center"><p className="text-slate-400">Loading Resume...</p></div>}
                        className="flex flex-col items-center gap-8 py-8 print:gap-0 print:py-0"
                    >
                        {Array.from({ length: numPages ?? 0 }, (_, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                scale={zoom}
                                devicePixelRatio={2.5}
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
