import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Droplets, ShieldCheck, AlertTriangle, Volume2 } from 'lucide-react';

const AdvisoryCard = ({ type, message, actionText }) => {
    const { t, lang } = useLanguage();

    const getStyle = () => {
        switch (type) {
            case 'warning': return { bg: '#FFF3E0', color: '#E65100', icon: <AlertTriangle size={32} /> };
            case 'healthy': return { bg: '#E8F5E9', color: '#2E7D32', icon: <ShieldCheck size={32} /> };
            case 'water': return { bg: '#E3F2FD', color: '#1565C0', icon: <Droplets size={32} /> };
            default: return { bg: '#F5F5F5', color: '#616161', icon: <ShieldCheck size={32} /> };
        }
    };

    const style = getStyle();

    const speak = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(`${message}. ${actionText}`);
            const langMap = { 'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN' };
            utterance.lang = langMap[lang] || 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="card animate-fade-in" style={{ backgroundColor: style.bg, borderLeft: `4px solid ${style.color}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ color: style.color, marginRight: '16px' }}>
                        {style.icon}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: style.color }}>{message}</h3>
                        <p style={{ margin: 0, color: '#333' }}>{actionText}</p>
                    </div>
                </div>

                <button
                    onClick={speak}
                    style={{
                        background: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginLeft: '8px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    title={t('listen')}
                >
                    <Volume2 size={22} color={style.color} />
                </button>
            </div>
        </div>
    );
};

export default AdvisoryCard;
