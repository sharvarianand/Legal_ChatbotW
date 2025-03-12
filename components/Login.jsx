import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { translate, language, setLanguage } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('chatHistory', JSON.stringify([]));
            navigate('/home');
        } else {
            setError('invalidCredentials');
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div>
            <select value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="te">తెలుగు (Telugu)</option>
            </select>

            <div className="login-container">
                <h2>{translate('login')}</h2>
                <form onSubmit={handleSubmit}>
                    <label>{translate('username')}</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>{translate('password')}</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{translate('loginButton')}</button>
                </form>
                {error && <div style={{ color: 'red' }}>{translate(error)}</div>}
            </div>
        </div>
    );
}

export default Login;
