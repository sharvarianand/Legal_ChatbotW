import React, { createContext, useState, useContext } from 'react';

const translations = {
    en: {
        toggleSidePanel: 'Toggle Side Panel',
        toggleChatHistory: 'Toggle Chat History',
        noChatHistory: 'No chat history available.',
        login: 'Login',
        username: 'Username:',
        password: 'Password:',
        loginButton: 'Login',
        invalidCredentials: 'Invalid username or password',
        logout: 'Logout'
    },
    hi: {
        toggleSidePanel: 'साइड पैनल टॉगल करें',
        toggleChatHistory: 'चैट इतिहास टॉगल करें',
        noChatHistory: 'कोई चैट इतिहास उपलब्ध नहीं है।',
        login: 'लॉगिन',
        username: 'उपयोगकर्ता नाम:',
        password: 'पासवर्ड:',
        loginButton: 'लॉगिन',
        invalidCredentials: 'अमान्य उपयोगकर्ता नाम या पासवर्ड',
        logout: 'लॉगआउट'
    },
    mr: {
        toggleSidePanel: 'साइड पॅनेल टॉगल करा',
        toggleChatHistory: 'चॅट इतिहास टॉगल करा',
        noChatHistory: 'कोणताही चॅट इतिहास उपलब्ध नाही.',
        login: 'लॉगिन',
        username: 'वापरकर्तानाव:',
        password: 'पासवर्ड:',
        loginButton: 'लॉगिन',
        invalidCredentials: 'अवैध वापरकर्तानाव किंवा पासवर्ड',
        logout: 'लॉगआउट'
    },
    gu: {
        toggleSidePanel: 'સાઇડ પેનલ ટૉગલ કરો',
        toggleChatHistory: 'ચેટ ઇતિહાસ ટૉગલ કરો',
        noChatHistory: 'કોઈ ચેટ ઇતિહાસ ઉપલબ્ધ નથી.',
        login: 'લૉગિન',
        username: 'વપરાશકર્તા નામ:',
        password: 'પાસવર્ડ:',
        loginButton: 'લૉગિન',
        invalidCredentials: 'અમાન્ય વપરાશકર્તા નામ અથવા પાસવર્ડ',
        logout: 'લૉગઆઉટ'
    },
    kn: {
        toggleSidePanel: 'ಬದಿಯ ಪ್ಯಾನೆಲ್ ಟಾಗಲ್ ಮಾಡಿ',
        toggleChatHistory: 'ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಟಾಗಲ್ ಮಾಡಿ',
        noChatHistory: 'ಯಾವುದೇ ಚಾಟ್ ಇತಿಹಾಸ ಲಭ್ಯವಿಲ್ಲ.',
        login: 'ಲಾಗಿನ್',
        username: 'ಬಳಕೆದಾರ ಹೆಸರು:',
        password: 'ಪಾಸ್ವರ್ಡ್:',
        loginButton: 'ಲಾಗಿನ್',
        invalidCredentials: 'ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್ವರ್ಡ್',
        logout: 'ಲಾಗ್ ಔಟ್'
    },
    te: {
        toggleSidePanel: 'సైడ్ పానెల్‌ను టోగుల్ చేయండి',
        toggleChatHistory: 'చాట్ చరిత్రను టోగుల్ చేయండి',
        noChatHistory: 'చాట్ చరిత్ర అందుబాటులో లేదు.',
        login: 'లాగిన్',
        username: 'వాడుకరి పేరు:',
        password: 'పాస్‌వర్డ్:',
        loginButton: 'లాగిన్',
        invalidCredentials: 'చెల్లని వాడుకరి పేరు లేదా పాస్‌వర్డ్',
        logout: 'లాగౌట్'
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const translate = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
