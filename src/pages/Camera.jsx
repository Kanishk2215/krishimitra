import React from 'react';
import CameraCapture from '../components/CameraCapture';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Camera = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div style={{ height: '100vh', background: '#000' }}>
            <div style={{
                padding: '16px',
                position: 'absolute',
                zIndex: 10,
                top: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                >
                    <ArrowLeft /> Back
                </button>
            </div>
            <div style={{ paddingTop: '80px' }}>
                <CameraCapture />
            </div>
        </div>
    );
};

export default Camera;
