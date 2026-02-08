const CONFIG = {
    // ⚠️ REPLACE THIS WITH YOUR RAILWAY/RENDER BACKEND URL AFTER DEPLOYING ⚠️
    PRODUCTION_API_URL: "https://krishimitra-backend.up.railway.app",

    // ⚠️ REPLACE THIS WITH YOUR RENDER ML URL AFTER DEPLOYING ⚠️
    PRODUCTION_ML_URL: "https://krishimitra-ml.onrender.com",

    // Default Local URLs
    LOCAL_API_URL: "http://localhost:5000",
    LOCAL_ML_URL: "http://localhost:5001"
};

function getApiUrl() {
    const host = window.location.hostname;
    // If running on Vercel or public domain, use Production URL
    if (host.includes('vercel.app') || host.includes('netlify.app') || host.includes('render.com')) {
        return CONFIG.PRODUCTION_API_URL;
    }
    // If using LocalTunnel
    if (host.includes('loca.lt') || host.includes('ngrok')) {
        return 'https://krishimitra-api.loca.lt'; // Or update this if needed
    }
    // Default to Local
    const localIP = host === 'localhost' ? '127.0.0.1' : host;
    return `http://${localIP}:5000`;
}

function getMlUrl() {
    const host = window.location.hostname;
    if (host.includes('vercel.app') || host.includes('netlify.app') || host.includes('render.com')) {
        return CONFIG.PRODUCTION_ML_URL;
    }
    if (host.includes('loca.lt') || host.includes('ngrok')) {
        return 'https://krishimitra-ml.loca.lt';
    }
    const localIP = host === 'localhost' ? '127.0.0.1' : host;
    return `http://${localIP}:5001`;
}
