import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getHistory } from '../utils/aiEngine';

const History = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        if (status === 'healthy') return 'var(--accent-green)';
        if (status === 'warning') return 'var(--accent-orange)';
        return 'var(--accent-red)';
    }

    return (
        <div className="container animate-fade-in">
            <header style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                gap: '16px'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer' }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ margin: 0, color: 'var(--primary-blue)' }}>{t('history_title')}</h2>
            </header>

            {history.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '40px' }}>
                    <Clock size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <p>{t('no_history')}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {history.map((item) => (
                        <div key={item.id} className="card" style={{ margin: 0, borderLeft: `6px solid ${getStatusColor(item.status)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.diseaseName}</h3>
                                <span style={{ fontSize: '0.8rem', color: '#999' }}>{formatDate(item.timestamp)}</span>
                            </div>

                            <p style={{ margin: '0 0 8px 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                {item.symptoms}
                            </p>

                            <div style={{ background: '#F5F5F5', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--primary-blue)' }}>{t('ai_solution')}</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.treatment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
