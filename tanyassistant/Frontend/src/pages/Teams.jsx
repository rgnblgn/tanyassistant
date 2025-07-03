// src/pages/Login.jsx
import React, { useState } from 'react';

const Teams = () => {

    const handleButton = async () => {

        fetch('http://localhost:4000/api/teams')
            .then(res => res.json())
            .then(data => setRecords(data))
            .catch(err => console.error('GET /api/teams failed:', err));
    }


    return (
        <div className="login-container">

            <button onClick={handleButton}>Giriş Yap</button>
        </div>
    );
};

export default Teams;
