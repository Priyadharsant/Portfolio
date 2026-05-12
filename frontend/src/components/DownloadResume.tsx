import { useEffect, useState } from 'react';
import { apiUrl } from '../utils/api';

const DownloadResume = () => {
    const [status, setStatus] = useState('Starting download...');

    useEffect(() => {
        document.title = 'Downloading Resume... | Priyadharsan T';
        
        const download = async () => {
            try {
                const response = await fetch(apiUrl('/api/resume?download=true'));
                
                if (!response.ok) {
                    throw new Error('Failed to download resume');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'resume.pdf';
                
                document.body.appendChild(a);
                a.click();
                
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                setStatus('Download complete! Returning to portfolio...');
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } catch (err) {
                console.error('Download error:', err);
                setStatus('Download failed. Returning to portfolio...');
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        };

        download();
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#06070b] px-5 text-center text-slate-100">
            <div className="glass-panel max-w-md rounded-lg p-6">
                <h1 className="text-xl font-semibold text-white">Downloading Resume</h1>
                <p className="mt-3 text-slate-300">{status}</p>
            </div>
        </main>
    );
};

export default DownloadResume;
