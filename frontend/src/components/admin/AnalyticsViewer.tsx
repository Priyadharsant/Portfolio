import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Globe2, Activity, CalendarDays } from 'lucide-react';
import { apiUrl } from '../../utils/api';

type AnalyticsData = {
    totalVisits: number;
    uniqueVisitors: number;
    recentVisits: Array<{
        _id: string;
        type: string;
        ip: string;
        ua: string;
        createdAt: string;
    }>;
    dateWiseStats: Array<{
        _id: string; // date string
        totalVisits: number;
        uniqueVisitors: number;
    }>;
};

type AnalyticsViewerProps = {
    token: string;
    onClose: () => void;
};

export default function AnalyticsViewer({ token, onClose }: AnalyticsViewerProps) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(apiUrl('/api/admin/portfolio/analytics'), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message || 'Failed to load analytics');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c111e] dark:border dark:border-white/10"
            >
                {/* Header */}
                <div className="flex flex-none items-center justify-between border-b border-slate-200 bg-slate-50/50 p-6 px-8 dark:border-white/10 dark:bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Visitor Analytics</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track and monitor your portfolio traffic.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-teal-500" />
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : data ? (
                        <div className="space-y-8">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
                                            <Activity className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Page Views</p>
                                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{data.totalVisits.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Unique Visitors</p>
                                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{data.uniqueVisitors.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Activity Stats */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c111e]">
                                <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5 text-slate-400" />
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Traffic</h3>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 dark:bg-white/[0.02] dark:text-slate-400">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Date</th>
                                                <th className="px-6 py-4 font-medium">Total Page Views</th>
                                                <th className="px-6 py-4 font-medium">Unique Visitors</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                            {data.dateWiseStats?.map((stat) => (
                                                <tr key={stat._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                                        {new Date(stat._id).toLocaleDateString(undefined, { 
                                                            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        <span className="inline-flex items-center justify-center rounded-full bg-teal-100 px-2.5 py-0.5 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 font-medium">
                                                            {stat.totalVisits.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 font-medium">
                                                            {stat.uniqueVisitors.toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!data.dateWiseStats || data.dateWiseStats.length === 0) && (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                                        No daily stats recorded yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activity Log */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c111e]">
                                <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Globe2 className="h-5 w-5 text-slate-400" />
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Activity Log</h3>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 dark:bg-white/[0.02] dark:text-slate-400">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Time</th>
                                                <th className="px-6 py-4 font-medium">IP Address</th>
                                                <th className="px-6 py-4 font-medium">Device / Browser</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                            {data.recentVisits.map((visit) => (
                                                <tr key={visit._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        {new Date(visit.createdAt).toLocaleString(undefined, { 
                                                            month: 'short', day: 'numeric', 
                                                            hour: 'numeric', minute: '2-digit' 
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                                                        {visit.ip}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        <span className="line-clamp-1 max-w-md text-xs" title={visit.ua}>
                                                            {visit.ua}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.recentVisits.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                                        No visitors recorded yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </motion.div>
        </motion.div>
    );
}
