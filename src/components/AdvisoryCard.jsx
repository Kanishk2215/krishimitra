import React from 'react';
import { Droplets, ShieldCheck, AlertTriangle } from 'lucide-react';

const AdvisoryCard = ({ type, message, actionText }) => {
    const getIcon = () => {
        switch (type) {
            case 'water': return <Droplets size={32} color="white" />;
            case 'healthy': return <ShieldCheck size={32} color="white" />;
            case 'warning': return <AlertTriangle size={32} color="white" />;
            default: return <ShieldCheck size={32} />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'water': return 'var(--secondary-blue)';
            case 'healthy': return 'var(--accent-green)';
            case 'warning': return 'var(--accent-red)';
            default: return 'var(--primary-blue)';
        }
    };

    return (
        <div className="card" style={{
            backgroundColor: getBgColor(),
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
            <div style={{ marginRight: '8px' }}>
                {getIcon()}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{message}</h3>
                {actionText && <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>{actionText}</p>}
            </div>
        </div>
    );
};

export default AdvisoryCard;
