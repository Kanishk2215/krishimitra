import React from 'react';
import { Thermometer, Droplet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DiseaseSensor = ({ moisture = 35, temp = 30 }) => {
    const { t } = useLanguage();

    return (
        <div className="card">
            <h3 style={{ marginTop: 0 }}>Sensor Data</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        color: 'var(--primary-blue)',
                        marginBottom: '8px',
                        background: '#E1F5FE',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px auto'
                    }}>
                        <Droplet size={24} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{moisture}%</span>
                    <br />
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{t('moisture')}</span>
                </div>

                <div style={{ width: '1px', height: '50px', background: '#eee' }}></div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        color: 'var(--accent-orange)',
                        marginBottom: '8px',
                        background: '#FFF3E0',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px auto'
                    }}>
                        <Thermometer size={24} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{temp}°C</span>
                    <br />
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{t('temp')}</span>
                </div>

            </div>
        </div>
    );
};

export default DiseaseSensor;
