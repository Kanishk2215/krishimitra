import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const languages = {
    en: {
        name: 'English',
        welcome: 'Welcome, Farmer',
        title: 'Smart Crop Advisory',
        water_alert: 'Water Required Today',
        healthy_msg: 'Crop is Healthy',
        analyze_btn: 'Scan Crop',
        login_btn: 'Login with Phone',
        guest_btn: 'Continue as Guest',
        moisture: 'Soil Moisture',
        temp: 'Temperature',
        kb_title: 'Crop Diseases',
        treatment: 'Treatment',
        logout: 'Logout',
        history_title: 'History',
        view_report: 'View Report',
        no_history: 'No past scans found.',
        ai_solution: 'AI Solution',
        prevention: 'Prevention',
        cause: 'Cause'
    },
    hi: {
        name: 'हिंदी',
        welcome: 'स्वागत है, किसान',
        title: 'स्मार्ट फसल सलाह',
        water_alert: 'आज पानी की आवश्यकता है',
        healthy_msg: 'फसल स्वस्थ है',
        analyze_btn: 'फसल स्कैन करें',
        login_btn: 'फोन से लॉग इन करें',
        guest_btn: 'गेस्ट के रूप में जारी रखें',
        moisture: 'मिट्टी की नमी',
        temp: 'तापमान',
        kb_title: 'फसल के रोग',
        treatment: 'उपचार',
        logout: 'लॉग आउट',
        history_title: 'पुराने स्कैन',
        view_report: 'रिपोर्ट देखें',
        no_history: 'कोई पुराना स्कैन नहीं मिला।',
        ai_solution: 'AI उपाय',
        prevention: 'रोकथाम',
        cause: 'कारण'
    },
    ta: {
        name: 'தமிழ்',
        welcome: 'வணக்கம், விவசாயி',
        title: 'ஸ்மார்ட் பயிர் ஆலோசனை',
        water_alert: 'இன்று தண்ணீர் தேவை',
        healthy_msg: 'பயிர் ஆரோக்கியமானது',
        analyze_btn: 'பயிரை ஸ்கேன் செய்',
        login_btn: 'மொபைல் மூலம் உள்நுழைக',
        guest_btn: 'விருந்தினராக தொடரவும்',
        moisture: 'மண் ஈரம்',
        temp: 'வெப்பநிலை',
        kb_title: 'பயிர் நோய்கள்',
        treatment: 'சிகச்சை',
        logout: 'வெளியேறு',
        history_title: 'வரலாறு',
        view_report: 'அறிக்கையைப் பார்',
        no_history: 'கடந்தகால ஸ்கேன் எதுவும் இல்லை.',
        ai_solution: 'AI தீர்வு',
        prevention: 'தடுப்பு',
        cause: 'காரணம்'
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    const t = (key) => {
        return languages[lang]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
