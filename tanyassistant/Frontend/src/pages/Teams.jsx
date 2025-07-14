// src/pages/Login.jsx
import React, { useState } from 'react';

const Teams = () => {
    const API_BASE = 'http://localhost:4000/api';
    const handleButton = async () => {
        let token = localStorage.getItem('authToken')

        const res = await fetch(`http://localhost:4000/api/jira/getAllStatus`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
    }


    return (
        <div className="login-container">

            <button onClick={handleButton}>Giriş Yap</button>
        </div>
    );
};

export default Teams;
