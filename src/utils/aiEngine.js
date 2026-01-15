// Simulate AI Analysis locally
export const analyzeCrop = async (imageData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Logic to determine "random" disease for demo purposes
            // In a real app, this would be a TF.js model.

            const scenarios = [
                {
                    status: 'disease',
                    diseaseName: 'Early Blight',
                    confidence: 94,
                    symptoms: 'Target-like spots with yellow halos on older leaves.',
                    cause: 'Fungal infection (Alternaria solani) triggered by warm, wet weather.',
                    prevention: 'Ensure proper spacing for air circulation. Avoid overhead irrigation.',
                    treatment: 'Apply copper-based fungicides or Neem oil every 7-10 days.',
                    waterAdvice: 'Water at the base only.'
                },
                {
                    status: 'disease',
                    diseaseName: 'Leaf Curl Virus',
                    confidence: 89,
                    symptoms: 'Leaves curling upward, stunted growth, yellowing.',
                    cause: 'Transmitted by Whiteflies.',
                    prevention: 'Use yellow sticky traps to witness whitefly population.',
                    treatment: 'No chemical cure. Remove infected plants immediately to stop spread.',
                    waterAdvice: 'Maintain regular watering schedule to reduce stress.'
                },
                {
                    status: 'healthy',
                    diseaseName: 'Healthy Crop',
                    confidence: 98,
                    symptoms: 'No visible signs of stress or disease.',
                    cause: 'N/A',
                    prevention: 'Continue monitoring weekly.',
                    treatment: 'N/A',
                    waterAdvice: 'Keep soil moist but not waterlogged.'
                },
                {
                    status: 'warning',
                    diseaseName: 'Water Stress (Wilting)',
                    confidence: 92,
                    symptoms: 'Drooping leaves, dry soil surface.',
                    cause: 'Insufficient water supply.',
                    prevention: 'Mulch soil to retain moisture.',
                    treatment: 'Water immediately (early morning or late evening).',
                    waterAdvice: 'Immediate irrigation required.'
                }
            ];

            // Randomly select a scenario for the user to see variety
            const result = scenarios[Math.floor(Math.random() * scenarios.length)];

            resolve({
                ...result,
                id: Date.now(),
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
};

export const saveResult = (result) => {
    const history = JSON.parse(localStorage.getItem('crop_history') || '[]');
    history.unshift(result);
    localStorage.setItem('crop_history', JSON.stringify(history));
};

export const getHistory = () => {
    return JSON.parse(localStorage.getItem('crop_history') || '[]');
};
