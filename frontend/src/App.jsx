import React from 'react';
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';

import ChatComponent from './components/Chatcomponent.jsx';
import Login from './components/Login.jsx'; // Assuming you create a Login component



function App() {
  const isAuthenticated = localStorage.getItem('authenticated');

  return (
    <Router>
      <div className="App">
        <Route path="/login" component={Login} />
        <Route path="/chat" element={
          isAuthenticated ? <ChatComponent /> : <Navigate to="/login" />
        } />
        <Navigate from="/" to="/login" />

      </div>
    </Router>
  );
}


export default App;
