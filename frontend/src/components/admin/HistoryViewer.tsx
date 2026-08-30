import { useState, useEffect } from 'react';

import { History, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { apiUrl } from '../../utils/api';
import type { PortfolioData } from '../../types/portfolio';

interface Revision {
  _id: string;
  revisionCreatedAt: string;
  changes?: string[];
  isRevert?: boolean;
  data: PortfolioData;
}

interface HistoryViewerProps {
  token: string;
  onRestore: (data: PortfolioData) => void;
}

export default function HistoryViewer({ token, onRestore }: HistoryViewerProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevisions = async () => {
      try {
        const response = await fetch(apiUrl('/api/admin/portfolio/revisions'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch version history');
        const data = await response.json();
        setRevisions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevisions();
  }, [token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p>Loading version history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-red-500">
        <AlertCircle className="w-8 h-8 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (revisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <History className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No History Yet</h3>
        <p className="text-center text-sm max-w-sm">
          Every time you save changes, a backup version will be created automatically. You can restore them from here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {revisions.map((rev) => (
        <div key={rev._id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-teal-500/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Backup from {formatDate(rev.revisionCreatedAt)}</h4>
              <div className="mt-2">
                <span className="text-xs text-slate-500 font-medium mb-1 block">State prior to editing:</span>
                <div className="flex flex-wrap gap-2">
                  {rev.isRevert ? (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-md border border-purple-200 dark:border-purple-500/30">
                      Restored from Backup
                    </span>
                  ) : rev.changes && rev.changes.length > 0 ? (
                    rev.changes.map((change, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-md border border-amber-200 dark:border-amber-500/30">
                        {change}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">
                      Minor edits
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onRestore(rev.data)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
          >
            Preview & Restore
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
