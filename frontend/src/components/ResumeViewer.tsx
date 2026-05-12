import { useEffect } from 'react';
import { apiUrl } from '../utils/api';

const ResumeViewer = () => {
    useEffect(() => {
        document.title = 'Resume | Priyadharsan T';
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                src={apiUrl('/api/resume')}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Resume"
            />
        </div>
    );
};

export default ResumeViewer;
