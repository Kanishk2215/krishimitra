import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Smartphone, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/send-otp', { phone });
            if (res.data.success) {
                setStep(2);
                // For DEV only - alert OTP if returned
                if (res.data.debug_otp) alert(`DEV OTP: ${res.data.debug_otp}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/verify-otp', { phone, otp });
            if (res.data.success) {
                login(res.data.user, res.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-700">🌾 AgriFarm</h1>
                    <p className="text-gray-500 mt-2">Smart Crop Advisory System</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-green-500 mb-4">
                            <Smartphone className="text-gray-400 w-5 h-5 mr-2" />
                            <input
                                type="tel"
                                className="w-full outline-none"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center"
                        >
                            {loading ? 'Sending...' : 'Send OTP'} <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-500">Enter OTP sent to</p>
                            <p className="font-semibold text-gray-800">{phone}</p>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-xs text-green-600 hover:underline mt-1"
                            >
                                Change Number
                            </button>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            One Time Password
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:ring-2 ring-green-500 mb-6 outline-none"
                            placeholder="000000"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'} <CheckCircle className="w-4 h-4 ml-2" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
