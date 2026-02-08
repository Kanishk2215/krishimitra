import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FarmForm = () => {
    const [form, setForm] = useState({
        district: 'Nashik',
        soil_type: 'Black',
        land_size: 2.5
    });
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await api.post('/farms', form);
            localStorage.setItem('farmId', res.data.id);
            navigate('/dashboard');
        } catch (e) {
            alert("Failed to save farm");
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Add Farm Profile</h2>
            <div className="space-y-4">
                <select
                    className="border p-2 w-full"
                    value={form.soil_type}
                    onChange={e => setForm({ ...form, soil_type: e.target.value })}
                >
                    <option value="Black">Black Soil</option>
                    <option value="Red">Red Soil</option>
                    <option value="Alluvial">Alluvial Soil</option>
                </select>

                <input
                    className="border p-2 w-full"
                    placeholder="District"
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                />

                <button className="bg-blue-600 text-white p-2 w-full" onClick={handleSubmit}>Save Profile</button>
            </div>
        </div>
    );
};

export default FarmForm;
