// src/pages/Login.jsx
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jiraBaseUrl, setjiraBaseUrl] = useState('');


    const handleLogin = async () => {
        const res = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jiraUsername: email, jiraPassword: password, jiraBaseUrl })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('authToken', data.token);
            onLogin();
        } else {
            alert(data.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <h2>Jira Girişi</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input placeholder="BaseUrl" value={jiraBaseUrl} onChange={(e) => setjiraBaseUrl(e.target.value)} />

            <button onClick={handleLogin}>Giriş Yap</button>
        </div>
    );
};

export default Login;
