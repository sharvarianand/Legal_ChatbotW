import React, { useState } from 'react';
import axios from 'axios';
import config from './config';

const ChatComponent = () => {
    const [response, setResponse] = useState('');

    const testApiCall = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/test`);
            setResponse(res.data.message);
        } catch (error) {
            console.error("API call failed: ", error);
        }
    };

    return (
        <div>
            <button onClick={testApiCall}>Test API</button>
            <p>{response}</p>
        </div>
    );
};

export default ChatComponent;
