import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone } from 'lucide-react';

const Login = () => {
    const { t, setLang, lang } = useLanguage();
    const navigate = useNavigate();
    const [animating, setAnimating] = useState(false);

    const handleLogin = () => {
        setAnimating(true);
        setTimeout(() => {
            navigate('/home');
        }, 500);
    };

    return (
        <div className="container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div className={`animate-fade-in ${animating ? 'animate-fade-out' : ''}`}>
                <div style={{ color: 'var(--primary-blue)', marginBottom: '20px' }}>
                    <Sprout size={64} />
                </div>

                <h1 style={{ marginBottom: '8px' }}>{t('title')}</h1>
                <p style={{ color: 'var(--text-light)', marginBottom: '40px' }}>
                    By Farmers, For Farmers
                </p>

                <div className="card" style={{ width: '100%' }}>
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                    >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                    </select>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '12px' }}
                        onClick={handleLogin}
                    >
                        <Phone size={20} />
                        {t('login_btn')}
                    </button>

                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        onClick={handleLogin}
                    >
                        {t('guest_btn')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
