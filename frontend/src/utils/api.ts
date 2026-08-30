// const fallbackBackendUrl = 'http://localhost:3001';
const fallbackBackendUrl = import.meta.env.VITE_FALLBACK_BACKEND_URL || 'https://backend.priyan.online';

function resolveBackendUrl() {
  const configuredUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

  if (!configuredUrl) {
    return fallbackBackendUrl;
  }

  try {
    const configured = new URL(configuredUrl);

    if (typeof window !== 'undefined' && configured.hostname === window.location.hostname) {
      return fallbackBackendUrl;
    }

    return configured.toString().replace(/\/$/, '');
  } catch {
    return fallbackBackendUrl;
  }
}

const backendUrl = resolveBackendUrl();

export function apiUrl(path: string) {
  return `${backendUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export const getAnalytics = async (token: string) => {
    const res = await fetch(apiUrl('/api/admin/portfolio/analytics'), {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
};

export const getVapidPublicKey = async (token: string) => {
    const res = await fetch(apiUrl('/api/admin/portfolio/vapidPublicKey'), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch VAPID key');
    return res.json();
};

export const subscribePush = async (token: string, subscription: any, deviceName: string) => {
    const res = await fetch(apiUrl('/api/admin/portfolio/subscribe'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscription, deviceName })
    });
    if (!res.ok) throw new Error('Failed to subscribe');
    return res.json();
};
