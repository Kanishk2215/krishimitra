import React, { useState, useEffect } from 'react';
import {
    getUserLocation,
    getWeatherByCoords,
    saveLocation,
    getSavedLocation,
    clearSavedLocation
} from '../services/weatherService';
import './LocationSettings.css';

const LocationSettings = ({ onLocationSaved, onClose }) => {
    const [locationMethod, setLocationMethod] = useState('auto'); // 'auto' or 'manual'
    const [manualCity, setManualCity] = useState('');
    const [manualState, setManualState] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Indian states for dropdown
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    // City coordinates mapping (major cities)
    const cityCoordinates = {
        'Mumbai': { lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
        'Delhi': { lat: 28.7041, lon: 77.1025, state: 'Delhi' },
        'Bangalore': { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
        'Bengaluru': { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
        'Chennai': { lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
        'Kolkata': { lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
        'Hyderabad': { lat: 17.3850, lon: 78.4867, state: 'Telangana' },
        'Pune': { lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
        'Ahmedabad': { lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
        'Surat': { lat: 21.1702, lon: 72.8311, state: 'Gujarat' },
        'Jaipur': { lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
        'Lucknow': { lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh' },
        'Kanpur': { lat: 26.4499, lon: 80.3319, state: 'Uttar Pradesh' },
        'Nagpur': { lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
        'Indore': { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
        'Thane': { lat: 19.2183, lon: 72.9781, state: 'Maharashtra' },
        'Bhopal': { lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh' },
        'Visakhapatnam': { lat: 17.6868, lon: 83.2185, state: 'Andhra Pradesh' },
        'Pimpri-Chinchwad': { lat: 18.6298, lon: 73.7997, state: 'Maharashtra' },
        'Patna': { lat: 25.5941, lon: 85.1376, state: 'Bihar' },
        'Vadodara': { lat: 22.3072, lon: 73.1812, state: 'Gujarat' },
        'Ghaziabad': { lat: 28.6692, lon: 77.4538, state: 'Uttar Pradesh' },
        'Ludhiana': { lat: 30.9010, lon: 75.8573, state: 'Punjab' },
        'Agra': { lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh' },
        'Nashik': { lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
        'Faridabad': { lat: 28.4089, lon: 77.3178, state: 'Haryana' },
        'Meerut': { lat: 28.9845, lon: 77.7064, state: 'Uttar Pradesh' },
        'Rajkot': { lat: 22.3039, lon: 70.8022, state: 'Gujarat' },
        'Kalyan-Dombivali': { lat: 19.2403, lon: 73.1305, state: 'Maharashtra' },
        'Vasai-Virar': { lat: 19.4612, lon: 72.7985, state: 'Maharashtra' }
    };

    useEffect(() => {
        loadCurrentLocation();
    }, []);

    const loadCurrentLocation = () => {
        const saved = getSavedLocation();
        if (saved) {
            setCurrentLocation(saved);
            if (saved.city) {
                setManualCity(saved.city);
                setManualState(saved.state || '');
                setLocationMethod('manual');
            }
        }
    };

    const handleAutoLocation = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const position = await getUserLocation();
            const weather = await getWeatherByCoords(position.latitude, position.longitude);

            const locationData = {
                latitude: position.latitude,
                longitude: position.longitude,
                city: weather.city,
                method: 'auto'
            };

            saveLocation(locationData);
            setCurrentLocation(locationData);
            setSuccess(true);

            if (onLocationSaved) {
                onLocationSaved(locationData);
            }

            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);

        } catch (err) {
            setError(err.message || 'Failed to get location');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSave = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            if (!manualCity.trim()) {
                setError('Please enter a city name');
                setLoading(false);
                return;
            }

            // Check if city is in our database
            const cityKey = Object.keys(cityCoordinates).find(
                key => key.toLowerCase() === manualCity.trim().toLowerCase()
            );

            if (cityKey) {
                const coords = cityCoordinates[cityKey];
                const locationData = {
                    latitude: coords.lat,
                    longitude: coords.lon,
                    city: cityKey,
                    state: coords.state,
                    method: 'manual'
                };

                saveLocation(locationData);
                setCurrentLocation(locationData);
                setSuccess(true);

                if (onLocationSaved) {
                    onLocationSaved(locationData);
                }

                setTimeout(() => {
                    if (onClose) onClose();
                }, 1500);
            } else {
                setError(`City "${manualCity}" not found. Try: Mumbai, Delhi, Bangalore, etc.`);
            }

        } catch (err) {
            setError(err.message || 'Failed to save location');
        } finally {
            setLoading(false);
        }
    };

    const handleClearLocation = () => {
        clearSavedLocation();
        setCurrentLocation(null);
        setManualCity('');
        setManualState('');
        setSuccess(false);
        setError(null);
    };

    return (
        <div className="location-settings">
            <div className="settings-header">
                <h2>📍 Location Settings</h2>
                {onClose && (
                    <button onClick={onClose} className="close-btn">×</button>
                )}
            </div>

            {/* Current Location Display */}
            {currentLocation && (
                <div className="current-location-display">
                    <div className="location-badge">
                        <span className="badge-icon">📍</span>
                        <div className="badge-info">
                            <strong>{currentLocation.city || 'Your Location'}</strong>
                            {currentLocation.state && <span>{currentLocation.state}</span>}
                            <small>
                                {currentLocation.method === 'auto' ? 'Auto-detected' : 'Manually set'}
                            </small>
                        </div>
                    </div>
                    <button onClick={handleClearLocation} className="btn-clear">
                        Clear
                    </button>
                </div>
            )}

            {/* Location Method Selection */}
            <div className="method-selection">
                <button
                    className={`method-btn ${locationMethod === 'auto' ? 'active' : ''}`}
                    onClick={() => setLocationMethod('auto')}
                >
                    <span className="method-icon">🎯</span>
                    <span>Auto-Detect</span>
                </button>
                <button
                    className={`method-btn ${locationMethod === 'manual' ? 'active' : ''}`}
                    onClick={() => setLocationMethod('manual')}
                >
                    <span className="method-icon">✏️</span>
                    <span>Manual Entry</span>
                </button>
            </div>

            {/* Auto Location */}
            {locationMethod === 'auto' && (
                <div className="location-method-content">
                    <div className="method-description">
                        <p>📍 Use your device's GPS to automatically detect your location.</p>
                        <p className="note">You'll be asked to allow location access.</p>
                    </div>
                    <button
                        onClick={handleAutoLocation}
                        disabled={loading}
                        className="btn-primary btn-large"
                    >
                        {loading ? '🔄 Detecting...' : '📍 Detect My Location'}
                    </button>
                </div>
            )}

            {/* Manual Location */}
            {locationMethod === 'manual' && (
                <div className="location-method-content">
                    <div className="method-description">
                        <p>✏️ Enter your city name manually.</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City Name *</label>
                        <input
                            type="text"
                            id="city"
                            value={manualCity}
                            onChange={(e) => setManualCity(e.target.value)}
                            placeholder="e.g., Mumbai, Delhi, Bangalore"
                            className="input-field"
                            list="city-suggestions"
                        />
                        <datalist id="city-suggestions">
                            {Object.keys(cityCoordinates).map(city => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State (Optional)</label>
                        <select
                            id="state"
                            value={manualState}
                            onChange={(e) => setManualState(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select State</option>
                            {indianStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleManualSave}
                        disabled={loading}
                        className="btn-primary btn-large"
                    >
                        {loading ? '💾 Saving...' : '💾 Save Location'}
                    </button>

                    <div className="supported-cities">
                        <p className="note">
                            <strong>Supported Cities:</strong> Mumbai, Delhi, Bangalore, Chennai, Kolkata,
                            Hyderabad, Pune, Ahmedabad, Nashik, and 20+ more major cities.
                        </p>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="message success">
                    ✅ Location saved successfully!
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="message error">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};

export default LocationSettings;
