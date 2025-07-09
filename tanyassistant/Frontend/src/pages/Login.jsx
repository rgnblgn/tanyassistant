// src/pages/Login.jsx
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Formun reload yapmasını engeller

        const res = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jiraUsername: email,
                jiraPassword: password,
            })
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

            <form onSubmit={handleLogin} autoComplete="on">
                <input
                    type="text"
                    name="username"
                    placeholder="Jira Email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Jira Şifre"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Giriş Yap</button>
            </form>
        </div>
    );
};

export default Login;
