import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Smartphone, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', {
                phone: formData.phone,
                password: formData.password
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                password: formData.password
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
                navigate('/onboarding');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-green-700 mb-2">🌾 Krishimitra</h1>
                    <p className="text-gray-600">Smart Crop Advisory System</p>
                </div>

                {/* Toggle Buttons */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 rounded-md transition ${isLogin ? 'bg-white shadow text-green-700 font-semibold' : 'text-gray-600'
                            }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md transition ${!isLogin ? 'bg-white shadow text-green-700 font-semibold' : 'text-gray-600'
                            }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Login Form */}
                {isLogin ? (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Number
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <Smartphone size={18} className="text-gray-400 mr-2" />
                                <span className="text-gray-400 mr-2">+91</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full outline-none"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <Lock size={18} className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full outline-none"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? 'Logging in...' : 'Login'} <CheckCircle size={18} className="ml-2" />
                        </button>
                    </form>
                ) : (
                    /* Register Form */
                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <User size={18} className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    name="firstName"
                                    className="w-full outline-none"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <User size={18} className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    name="lastName"
                                    className="w-full outline-none"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Number
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <Smartphone size={18} className="text-gray-400 mr-2" />
                                <span className="text-gray-400 mr-2">+91</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full outline-none"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <Lock size={18} className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full outline-none"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Re-enter Password
                            </label>
                            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 ring-green-500">
                                <Lock size={18} className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full outline-none"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? 'Creating Account...' : 'Register'} <CheckCircle size={18} className="ml-2" />
                        </button>
                    </form>
                )}

                {/* Security Notice */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 text-center">
                        🔒 Your password is encrypted with industry-standard security (bcrypt)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
