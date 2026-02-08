import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, CheckCircle, RotateCcw, AlertCircle, Image as ImageIcon } from 'lucide-react';
import AdvisoryCard from './AdvisoryCard';
import { analyzeCrop, saveResult } from '../utils/aiEngine';

const CameraCapture = ({ onAnalyze }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureDisplay = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const imgUrl = canvas.toDataURL('image/png');
            setImage(imgUrl);
            stopCamera();
            simulateAnalysis();
        }
    };

    const simulateAnalysis = async () => {
        setLoading(true);
        const analysisResult = await analyzeCrop(image);
        setResult({
            status: analysisResult.status,
            message: analysisResult.diseaseName,
            detail: analysisResult.treatment,
            confidence: analysisResult.confidence + '%'
        });
        saveResult(analysisResult);
        setLoading(false);
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        startCamera();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                stopCamera();
                simulateAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ padding: '0 16px' }}>
            {!image ? (
                <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    height: '60vh'
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Controls Overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: '32px',
                        left: '0',
                        right: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px'
                    }}>
                        {/* Capture Button */}
                        <button
                            onClick={captureDisplay}
                            style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                border: '4px solid rgba(255,255,255,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid black' }} />
                        </button>

                        {/* Upload Button */}
                        <label
                            htmlFor="file-upload"
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <ImageIcon size={24} color="black" />
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <img src={image} alt="Captured" style={{ width: '100%', borderRadius: '16px', maxHeight: '40vh', objectFit: 'cover', marginBottom: '16px' }} />

                    {loading ? (
                        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                            <div className="spinner" style={{
                                width: '40px', height: '40px',
                                border: '4px solid #eee',
                                borderTop: '4px solid var(--primary-blue)',
                                borderRadius: '50%',
                                margin: '0 auto 16px',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            <h3>Analyzing Crop Health...</h3>
                            <p>Checking for diseases and pests</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <AdvisoryCard
                                type={result.status === 'healthy' ? 'healthy' : 'warning'}
                                message={result.message}
                                actionText={result.detail}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '16px' }}>
                                <button className="btn btn-secondary" onClick={reset}>
                                    <RotateCcw size={18} /> Take Another Photo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraCapture;
