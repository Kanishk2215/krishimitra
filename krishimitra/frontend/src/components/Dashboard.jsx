import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load recommendations on mount
        fetchRecs();
    }, []);

    const fetchRecs = async () => {
        setLoading(true);
        try {
            const farmId = localStorage.getItem('farmId');
            if (!farmId) return;

            const res = await api.post('/recommend', { farmId });
            setRecs(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-green-800">My Farm Dashboard</h1>

            {/* Weather Widget Mock */}
            <div className="bg-blue-500 text-white p-4 rounded-xl mb-6 shadow-lg">
                <h3 className="font-bold">Nashik Weather (7 Day)</h3>
                <div className="flex justify-between mt-2">
                    <div className="text-center">
                        <span className="block text-2xl">Today</span>
                        <span className="text-3xl font-bold">28°C</span>
                        <span>☀️ Sunny</span>
                    </div>
                    <div className="text-center opacity-70">
                        <span className="block">Fri</span>
                        <span>27°C</span>
                    </div>
                    <div className="text-center opacity-70">
                        <span className="block">Sat</span>
                        <span>26°C</span>
                    </div>
                </div>
            </div>

            <button
                onClick={fetchRecs}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded shadow"
            >
                Refresh Recommendations
            </button>

            {loading && <p>Loading AI Analysis...</p>}

            <div className="grid gap-4">
                {recs.map((crop, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{crop.name}</h3>
                            <p className="text-sm text-gray-500">{crop.season} • {crop.duration_days} days</p>
                            <div className="mt-2 text-green-700 font-semibold">
                                Expected Profit: ₹{crop.avg_profit_per_acre}/acre
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            92% Match
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
