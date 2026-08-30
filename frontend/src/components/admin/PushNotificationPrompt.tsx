import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, Loader2 } from 'lucide-react';
import { getVapidPublicKey, subscribePush } from '../../utils/api';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

interface PushNotificationPromptProps {
    token: string;
    onComplete: () => void;
}

export default function PushNotificationPrompt({ token, onComplete }: PushNotificationPromptProps) {
    const [deviceName, setDeviceName] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guess a default device name based on user agent
    useEffect(() => {
        let name = 'Admin Device';
        const ua = navigator.userAgent;
        if (ua.includes('Mac OS')) name = 'MacBook';
        if (ua.includes('Windows')) name = 'Windows PC';
        if (ua.includes('iPhone')) name = 'iPhone';
        if (ua.includes('Android')) name = 'Android Phone';
        setDeviceName(name);
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deviceName.trim()) return setError('Device name is required');
        
        setIsSubscribing(true);
        setError(null);

        try {
            // 1. Request permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Notification permission denied by user.');
            }

            // 2. Register Service Worker
            if (!('serviceWorker' in navigator)) {
                throw new Error('Service Workers are not supported in this browser.');
            }
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // 3. Get VAPID key
            const vapidData = await getVapidPublicKey(token);
            const convertedVapidKey = urlBase64ToUint8Array(vapidData.publicKey);

            // 4. Subscribe
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // 5. Send to backend
            await subscribePush(token, subscription, deviceName.trim());

            // 6. Mark as registered locally
            localStorage.setItem('pushDeviceRegistered', 'true');
            
            onComplete();
        } catch (err: any) {
            console.error('Push registration failed:', err);
            setError(err.message || 'Failed to enable notifications');
            setIsSubscribing(false);
        }
    };

    const handleSkip = () => {
        // We'll just mark it so we don't bother them again this session, or persistently.
        localStorage.setItem('pushDeviceRegistered', 'skipped');
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm sm:p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c111e] dark:border dark:border-white/10"
            >
                {/* Header pattern */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-teal-500/20 to-blue-500/20 dark:from-teal-500/10 dark:to-blue-500/10" />
                
                <div className="relative px-6 pt-10 pb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                        <Bell className="h-8 w-8 text-teal-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enable Real-time Alerts</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Get instantly notified on this device whenever someone visits your portfolio or an error occurs.
                    </p>
                </div>

                <form onSubmit={handleSubscribe} className="px-6 pb-8 space-y-5">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Device Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                                placeholder="e.g. My Laptop"
                                disabled={isSubscribing}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-white/10 dark:bg-black/20 dark:text-white disabled:opacity-50"
                            />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            This name will help you manage your devices later.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={isSubscribing}
                            className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            Not Now
                        </button>
                        <button
                            type="submit"
                            disabled={isSubscribing}
                            className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-teal-600 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-teal-500/25"
                        >
                            {isSubscribing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Enabling...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-4 w-4" />
                                    Enable Notifications
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
