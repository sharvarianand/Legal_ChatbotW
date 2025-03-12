// ...existing code...

function toggleSidePanel() {
    const sidePanel = document.getElementById('side-panel');
    if (sidePanel) {
        if (sidePanel.style.display === 'none' || sidePanel.style.display === '') {
            sidePanel.style.display = 'block';
        } else {
            sidePanel.style.display = 'none';
        }
    }
}

function toggleChatHistory() {
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) {
        if (chatHistory.style.display === 'none' || chatHistory.style.display === '') {
            chatHistory.style.display = 'block';
        } else {
            chatHistory.style.display = 'none';
        }
    }
}

function changeLanguage(language) {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
}

const translations = {
    en: {
        toggleSidePanel: 'Toggle Side Panel',
        toggleChatHistory: 'Toggle Chat History',
        noChatHistory: 'No chat history available.',
        login: 'Login',
        username: 'Username:',
        password: 'Password:',
        loginButton: 'Login',
        invalidCredentials: 'Invalid username or password'
    },
    es: {
        toggleSidePanel: 'Alternar panel lateral',
        toggleChatHistory: 'Alternar historial de chat',
        noChatHistory: 'No hay historial de chat disponible.',
        login: 'Iniciar sesión',
        username: 'Nombre de usuario:',
        password: 'Contraseña:',
        loginButton: 'Iniciar sesión',
        invalidCredentials: 'Nombre de usuario o contraseña inválidos'
    },
    hi: {
        toggleSidePanel: 'साइड पैनल टॉगल करें',
        toggleChatHistory: 'चैट इतिहास टॉगल करें',
        noChatHistory: 'कोई चैट इतिहास उपलब्ध नहीं है।',
        login: 'लॉगिन',
        username: 'उपयोगकर्ता नाम:',
        password: 'पासवर्ड:',
        loginButton: 'लॉगिन',
        invalidCredentials: 'अमान्य उपयोगकर्ता नाम या पासवर्ड'
    },
    mr: {
        toggleSidePanel: 'साइड पॅनेल टॉगल करा',
        toggleChatHistory: 'चॅट इतिहास टॉगल करा',
        noChatHistory: 'कोणताही चॅट इतिहास उपलब्ध नाही.',
        login: 'लॉगिन',
        username: 'वापरकर्तानाव:',
        password: 'पासवर्ड:',
        loginButton: 'लॉगिन',
        invalidCredentials: 'अवैध वापरकर्तानाव किंवा पासवर्ड'
    },
    gu: {
        toggleSidePanel: 'સાઇડ પેનલ ટૉગલ કરો',
        toggleChatHistory: 'ચેટ ઇતિહાસ ટૉગલ કરો',
        noChatHistory: 'કોઈ ચેટ ઇતિહાસ ઉપલબ્ધ નથી.',
        login: 'લૉગિન',
        username: 'વપરાશકર્તા નામ:',
        password: 'પાસવર્ડ:',
        loginButton: 'લૉગિન',
        invalidCredentials: 'અમાન્ય વપરાશકર્તા નામ અથવા પાસવર્ડ'
    },
    kn: {
        toggleSidePanel: 'ಬದಿಯ ಪ್ಯಾನೆಲ್ ಟಾಗಲ್ ಮಾಡಿ',
        toggleChatHistory: 'ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಟಾಗಲ್ ಮಾಡಿ',
        noChatHistory: 'ಯಾವುದೇ ಚಾಟ್ ಇತಿಹಾಸ ಲಭ್ಯವಿಲ್ಲ.',
        login: 'ಲಾಗಿನ್',
        username: 'ಬಳಕೆದಾರ ಹೆಸರು:',
        password: 'ಪಾಸ್ವರ್ಡ್:',
        loginButton: 'ಲಾಗಿನ್',
        invalidCredentials: 'ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್ವರ್ಡ್'
    },
    te: {
        toggleSidePanel: 'సైడ్ పానెల్‌ను టోగుల్ చేయండి',
        toggleChatHistory: 'చాట్ చరిత్రను టోగుల్ చేయండి',
        noChatHistory: 'చాట్ చరిత్ర అందుబాటులో లేదు.',
        login: 'లాగిన్',
        username: 'వాడుకరి పేరు:',
        password: 'పాస్‌వర్డ్:',
        loginButton: 'లాగిన్',
        invalidCredentials: 'చెల్లని వాడుకరి పేరు లేదా పాస్‌వర్డ్'
    }
};

// Initialize language selector if it exists
document.addEventListener('DOMContentLoaded', function() {
    const selector = document.getElementById('language-selector');
    if (selector) {
        // Set default language
        changeLanguage('en');
    }
});

// ...existing code...
