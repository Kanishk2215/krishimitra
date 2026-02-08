const CONFIG = {
    // 🌍 YOUR PUBLIC HOST ID (Subdomain for LocalTunnel/Ngrok)
    HOST_ID: "krishimitra-live-hq",

    // ⚠️ Production URLs (Render/Vercel)
    PRODUCTION_API_URL: "https://krishimitra-1-cnf1.onrender.com",
    PRODUCTION_ML_URL: "https://krishimitra-ml.onrender.com",

    // Default Local URLs
    LOCAL_API_URL: "http://localhost:5000",
    LOCAL_ML_URL: "http://localhost:5001"
};

function getApiUrl() {
    const host = window.location.hostname;

    // 1. Check if running on Official Production (Render/Vercel)
    if (host.includes('onrender.com') || host.includes('vercel.app')) {
        return CONFIG.PRODUCTION_API_URL;
    }

    // 2. Check if using the Public Host ID (LocalTunnel)
    if (host.includes(CONFIG.HOST_ID)) {
        return `https://${CONFIG.HOST_ID}-api.loca.lt`;
    }

    // 3. Fallback to Local IP or Localhost
    const localIP = host === 'localhost' ? '127.0.0.1' : host;
    return `http://${localIP}:5000`;
}

function getMlUrl() {
    const host = window.location.hostname;

    if (host.includes('onrender.com') || host.includes('vercel.app')) {
        return CONFIG.PRODUCTION_ML_URL;
    }

    if (host.includes(CONFIG.HOST_ID)) {
        return `https://${CONFIG.HOST_ID}-ml.loca.lt`;
    }

    const localIP = host === 'localhost' ? '127.0.0.1' : host;
    return `http://${localIP}:5001`;
}

