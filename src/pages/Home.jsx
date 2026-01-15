import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AdvisoryCard from '../components/AdvisoryCard';
import DiseaseSensor from '../components/DiseaseSensor';
import { Camera, BookOpen, LogOut } from 'lucide-react';

const Home = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <h2 style={{ margin: 0, color: 'var(--primary-blue)' }}>{t('welcome')}</h2>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)' }}
                >
                    <LogOut size={20} />
                </button>
            </header>

            {/* Dynamic Advisory based on mock logic */}
            <section style={{ marginBottom: '24px' }}>
                <AdvisoryCard type="water" message={t('water_alert')} actionText="Soil moisture is low (35%)" />
            </section>

            {/* Sensor Data */}
            <section style={{ marginBottom: '24px' }}>
                <DiseaseSensor moisture={35} temp={32} />
            </section>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                    className="card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        border: '2px solid transparent',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/camera')}
                >
                    <div style={{
                        background: 'var(--primary-blue)',
                        padding: '12px',
                        borderRadius: '50%',
                        marginBottom: '12px'
                    }}>
                        <Camera color="white" size={28} />
                    </div>
                    <span style={{ fontWeight: '600' }}>{t('analyze_btn')}</span>
                </button>

                <button
                    className="card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/knowledge')}
                >
                    <div style={{
                        background: 'var(--accent-green)',
                        padding: '12px',
                        borderRadius: '50%',
                        marginBottom: '12px'
                    }}>
                        <BookOpen color="white" size={28} />
                    </div>
                    <span style={{ fontWeight: '600' }}>{t('kb_title')}</span>
                </button>

                <button
                    className="card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        cursor: 'pointer',
                        gridColumn: '1 / -1'
                    }}
                    onClick={() => navigate('/history')}
                >
                    <span style={{ fontWeight: '600', color: 'var(--text-light)' }}>{t('history_title')}</span>
                </button>
            </div>

        </div>
    );
};

export default Home;
