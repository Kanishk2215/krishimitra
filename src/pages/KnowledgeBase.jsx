import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const KnowledgeBase = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const diseases = [
        { name: 'Early Blight', symptom: 'Dark spots on lower leaves', treatment: 'Use organic fungicides like neem oil.' },
        { name: 'Leaf Curl', symptom: 'Curling and yellowing', treatment: 'Control aphids and whiteflies.' },
        { name: 'Root Rot', symptom: 'Yellow leaves, stunted growth', treatment: 'Improve drainage and reduce watering.' }
    ];

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
                <h2 style={{ margin: 0, color: 'var(--primary-blue)' }}>{t('kb_title')}</h2>
            </header>

            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input
                    type="text"
                    placeholder="Search diseases..."
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '12px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {diseases.map((d, i) => (
                    <div key={i} className="card" style={{ margin: 0 }}>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-dark)' }}>{d.name}</h3>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            <strong>Symptoms:</strong> {d.symptom}
                        </p>
                        <div style={{ background: '#E8F5E9', padding: '8px', borderRadius: '8px', color: '#2E7D32', fontSize: '0.9rem' }}>
                            <strong>{t('treatment')}:</strong> {d.treatment}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KnowledgeBase;
