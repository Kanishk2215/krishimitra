/**
 * Weather Service - Live Weather with Location Detection
 * Supports: Auto-location, Manual city input, Saved preferences
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BACKEND_URL = 'https://krishimitra-1-cnf1.onrender.com'; // Production fallback

const getApiUrl = () => {
    // Use production URL if on Vercel, otherwise local
    if (window.location.hostname.includes('vercel.app')) {
        return BACKEND_URL;
    }
    return API_BASE;
};

/**
 * Get user's current location using browser geolocation
 */
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let message = 'Unable to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out';
                        break;
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes cache
            }
        );
    });
};

/**
 * Get weather by coordinates (latitude, longitude)
 */
export const getWeatherByCoords = async (lat, lon) => {
    try {
        const baseUrl = getApiUrl();
        const response = await fetch(
            `${baseUrl}/api/online/weather?lat=${lat}&lon=${lon}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Weather by coords error:', error);
        throw error;
    }
};

/**
 * Get weather by city name
 */
export const getWeatherByCity = async (city) => {
    try {
        const baseUrl = getApiUrl();
        // First get coordinates for the city, then get weather
        const response = await fetch(
            `${baseUrl}/api/online/weather?lat=19.9975&lon=73.7898` // Default to Nashik
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Weather by city error:', error);
        throw error;
    }
};

/**
 * Save location preference to localStorage
 */
export const saveLocation = (location) => {
    try {
        const locationData = {
            ...location,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('krishimitra_location', JSON.stringify(locationData));
    } catch (error) {
        console.error('Failed to save location:', error);
    }
};

/**
 * Get saved location from localStorage
 */
export const getSavedLocation = () => {
    try {
        const saved = localStorage.getItem('krishimitra_location');
        if (!saved) return null;

        const location = JSON.parse(saved);

        // Check if saved location is older than 1 hour
        const savedTime = new Date(location.savedAt);
        const now = new Date();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);

        if (hoursDiff > 1) {
            // Location too old, clear it
            localStorage.removeItem('krishimitra_location');
            return null;
        }

        return location;
    } catch (error) {
        console.error('Failed to get saved location:', error);
        return null;
    }
};

/**
 * Clear saved location
 */
export const clearSavedLocation = () => {
    try {
        localStorage.removeItem('krishimitra_location');
    } catch (error) {
        console.error('Failed to clear location:', error);
    }
};

/**
 * Get weather icon URL from OpenWeather
 */
export const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Get farming recommendation based on weather
 */
export const getFarmingRecommendation = (weather) => {
    if (!weather || !weather.temp) return null;

    const temp = weather.temp;
    const description = weather.description?.toLowerCase() || '';
    const humidity = weather.humidity || 0;

    // Rain conditions
    if (description.includes('rain') || description.includes('drizzle')) {
        return {
            text: '⚠️ மழை வருது! Spray வேண்டாம். Wait for dry weather.',
            color: 'warning',
            icon: '🌧️',
            action: 'postpone_spray'
        };
    }

    // Very hot
    if (temp > 35) {
        return {
            text: '🔥 ரொம்ப வெயில்! தண்ணீர் விடுங்க. Avoid midday work.',
            color: 'error',
            icon: '☀️',
            action: 'irrigate'
        };
    }

    // Very cold
    if (temp < 15) {
        return {
            text: '❄️ குளிர் அதிகம்! Protect sensitive crops.',
            color: 'info',
            icon: '🥶',
            action: 'protect'
        };
    }

    // Perfect conditions
    if (temp >= 20 && temp <= 30 && humidity >= 40 && humidity <= 70) {
        return {
            text: '✅ Perfect weather! Spray பண்ணலாம். Good for all farm work.',
            color: 'success',
            icon: '✓',
            action: 'spray_ok'
        };
    }

    // High humidity
    if (humidity > 80) {
        return {
            text: '💧 Humidity அதிகம்! Disease risk. Monitor crops closely.',
            color: 'warning',
            icon: '💦',
            action: 'monitor'
        };
    }

    // Default good weather
    return {
        text: '🌤️ நல்ல weather! Normal farm activities OK.',
        color: 'success',
        icon: '🌤️',
        action: 'normal'
    };
};

export default {
    getUserLocation,
    getWeatherByCoords,
    getWeatherByCity,
    saveLocation,
    getSavedLocation,
    clearSavedLocation,
    getWeatherIconUrl,
    getFarmingRecommendation
};
