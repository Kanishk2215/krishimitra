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
        cause: 'Cause',
        password_placeholder: 'Enter Password',
        mobile_placeholder: 'Enter Mobile Number',
        firstname_placeholder: 'First Name',
        lastname_placeholder: 'Last Name',
        new_password_placeholder: 'New Password',
        re_password_placeholder: 'Re-enter Password',
        register_btn: 'Register',
        register_link: 'New User? Register Here',
        login_link: 'Already have an account? Login',
        password_mismatch: 'Passwords do not match',
        user_exists: 'User already exists',
        login_success: 'Login Successful',
        fill_all: 'Please fill all fields',
        listen: 'Listen',
        detecting: 'Analyzing...'
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
        cause: 'कारण',
        password_placeholder: 'पासवर्ड डालें',
        mobile_placeholder: 'मोबाइल नंबर डालें',
        firstname_placeholder: 'पहला नाम',
        lastname_placeholder: 'उपनाम',
        new_password_placeholder: 'नया पासवर्ड',
        re_password_placeholder: 'पासवर्ड पुनः डालें',
        register_btn: 'रजिस्टर करें',
        register_link: 'नया उपयोगकर्ता? यहाँ रजिस्टर करें',
        login_link: 'क्या आपके पास खाता है? लॉग इन करें',
        password_mismatch: 'पासवर्ड मेल नहीं खाते',
        user_exists: 'उपयोगकर्ता पहले से मौजूद है',
        login_success: 'लॉगिन सफल',
        fill_all: 'कृपया सभी जानकारी भरें',
        listen: ' सुनें',
        detecting: 'जांच की जा रही है...'
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
        cause: 'காரணம்',
        password_placeholder: 'கடவுச்சொல்லை உள்ளிடவும்',
        mobile_placeholder: 'மொபைல் எண்ணை உள்ளிடவும்',
        firstname_placeholder: 'முதல் பெயர்',
        lastname_placeholder: 'கடைசி பெயர்',
        new_password_placeholder: 'புதிய கடவுச்சொல்',
        re_password_placeholder: 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
        register_btn: 'பதிவு செய்',
        register_link: 'புதிய பயனர்? இங்கே பதிவு செய்யுங்கள்',
        login_link: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைய',
        password_mismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
        user_exists: 'பயனர் ஏற்கனவே உள்ளார்',
        login_success: 'வெற்றிகரமாக உள்நுழைந்தது',
        fill_all: 'அனைத்து விவரங்களையும் நிரப்பவும்',
        listen: 'கேளுங்கள்',
        detecting: 'ஆய்வு செய்கிறது...'
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
