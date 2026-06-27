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
