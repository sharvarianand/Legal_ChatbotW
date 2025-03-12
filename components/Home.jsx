import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles.css';

function Home() {
    const navigate = useNavigate();
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [showChatHistory, setShowChatHistory] = useState(false);
    const { translate, language, setLanguage } = useLanguage();

    useEffect(() => {
        // Check if user is authenticated
        if (!localStorage.getItem('authenticated')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        navigate('/login');
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div>
            <h1>Legal Chatbot</h1>
            
            <select value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="te">తెలుగు (Telugu)</option>
            </select>
            
            <button onClick={() => setShowSidePanel(!showSidePanel)}>
                {translate('toggleSidePanel')}
            </button>
            
            {showSidePanel && (
                <div className="side-panel">
                    {/* Side panel content */}
                    <p>Side panel content</p>
                </div>
            )}

            <button>🔍</button>
            
            <button onClick={() => setShowChatHistory(!showChatHistory)}>
                {translate('toggleChatHistory')}
            </button>
            
            {showChatHistory && (
                <div className="chat-history">
                    <p>{translate('noChatHistory')}</p>
                </div>
            )}

            <button onClick={handleLogout}>{translate('logout')}</button>
        </div>
    );
}

export default Home;
