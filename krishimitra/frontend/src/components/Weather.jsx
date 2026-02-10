import React, { useState, useEffect } from 'react';
import {
    getUserLocation,
    getWeatherByCoords,
    getSavedLocation,
    saveLocation,
    clearSavedLocation,
    getWeatherIconUrl,
    getFarmingRecommendation
} from '../services/weatherService';
import './Weather.css';

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationStatus, setLocationStatus] = useState('checking'); // checking, granted, denied, unavailable
    const [showLocationPrompt, setShowLocationPrompt] = useState(false);

    useEffect(() => {
        initializeWeather();
    }, []);

    const initializeWeather = async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Check for saved location
            const saved = getSavedLocation();
            if (saved && saved.latitude && saved.longitude) {
                console.log('Using saved location:', saved);
                await loadWeatherByCoords(saved.latitude, saved.longitude);
                setLocationStatus('granted');
                return;
            }

            // Step 2: Try to get current location
            try {
                const position = await getUserLocation();
                console.log('Got current location:', position);
                await loadWeatherByCoords(position.latitude, position.longitude);

                // Save for next time
                saveLocation({
                    latitude: position.latitude,
                    longitude: position.longitude
                });

                setLocationStatus('granted');
            } catch (locError) {
                console.log('Location error:', locError.message);

                if (locError.message.includes('denied')) {
                    setLocationStatus('denied');
                    setShowLocationPrompt(true);
                } else {
                    setLocationStatus('unavailable');
                }

                // Fallback to default location (Nashik)
                await loadWeatherByCoords(19.9975, 73.7898);
                setError('Using default location (Nashik). Enable location for your area.');
            }

        } catch (err) {
            console.error('Weather initialization error:', err);
            setError('Failed to load weather. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadWeatherByCoords = async (lat, lon) => {
        try {
            const data = await getWeatherByCoords(lat, lon);
            if (data.success) {
                setWeather(data);
                setError(null);
            } else {
                throw new Error('Weather data not available');
            }
        } catch (err) {
            throw err;
        }
    };

    const handleEnableLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            const position = await getUserLocation();
            await loadWeatherByCoords(position.latitude, position.longitude);

            saveLocation({
                latitude: position.latitude,
                longitude: position.longitude
            });

            setLocationStatus('granted');
            setShowLocationPrompt(false);
        } catch (err) {
            setError('Unable to get location. Please check browser settings.');
            setLocationStatus('denied');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        clearSavedLocation();
        initializeWeather();
    };

    if (loading && !weather) {
        return (
            <div className="weather-widget loading">
                <div className="loading-spinner"></div>
                <p>Loading weather... 🌤️</p>
            </div>
        );
    }

    if (showLocationPrompt && locationStatus === 'denied') {
        return (
            <div className="weather-widget location-prompt">
                <div className="prompt-content">
                    <span className="prompt-icon">📍</span>
                    <h3>Enable Location for Accurate Weather</h3>
                    <p>Get weather updates for your exact location to make better farming decisions.</p>
                    <button onClick={handleEnableLocation} className="btn-primary">
                        📍 Enable Location
                    </button>
                    <button onClick={() => setShowLocationPrompt(false)} className="btn-secondary">
                        Use Default Location
                    </button>
                </div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="weather-widget error">
                <p>⚠️ Weather data unavailable</p>
                <button onClick={handleRefresh} className="btn-refresh">
                    🔄 Retry
                </button>
            </div>
        );
    }

    const recommendation = getFarmingRecommendation(weather);

    return (
        <div className="weather-widget">
            {/* Header */}
            <div className="weather-header">
                <div className="location-info">
                    <h3>🌤️ {weather.city || 'Your Location'}</h3>
                    {locationStatus === 'denied' && (
                        <span className="location-badge">Default Location</span>
                    )}
                </div>
                <button onClick={handleRefresh} className="btn-refresh" title="Refresh weather">
                    🔄
                </button>
            </div>

            {/* Current Weather */}
            <div className="current-weather">
                <div className="weather-icon-large">
                    <img
                        src={getWeatherIconUrl(weather.icon)}
                        alt={weather.description}
                    />
                </div>
                <div className="weather-main">
                    <div className="temperature">
                        <span className="temp-value">{weather.temp}</span>
                        <span className="temp-unit">°C</span>
                    </div>
                    <p className="weather-description">{weather.description}</p>
                </div>
            </div>

            {/* Weather Details */}
            <div className="weather-details">
                <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <div className="detail-info">
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">{weather.humidity}%</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <div className="detail-info">
                        <span className="detail-label">Wind</span>
                        <span className="detail-value">{weather.wind} m/s</span>
                    </div>
                </div>
            </div>

            {/* Farming Recommendation */}
            {recommendation && (
                <div className={`recommendation ${recommendation.color}`}>
                    <span className="rec-icon">{recommendation.icon}</span>
                    <p className="rec-text">{recommendation.text}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="weather-error">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {/* Location Prompt */}
            {locationStatus === 'denied' && !showLocationPrompt && (
                <button
                    onClick={() => setShowLocationPrompt(true)}
                    className="btn-enable-location"
                >
                    📍 Enable Location for Your Area
                </button>
            )}
        </div>
    );
};

export default Weather;
