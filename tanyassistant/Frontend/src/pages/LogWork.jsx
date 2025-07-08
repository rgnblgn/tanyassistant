import React, { useState, useEffect } from 'react';
import './LogWork.css'

const LogWork = () => {
    const [username, setUsername] = useState('');
    const [savedUsers, setSavedUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [range, setRange] = useState('lastWeek');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('logUsers')) || [];
        setSavedUsers(saved);
    }, []);

    const saveUser = (user) => {
        if (!savedUsers.includes(user)) {
            const updated = [...savedUsers, user];
            setSavedUsers(updated);
            localStorage.setItem('logUsers', JSON.stringify(updated));
        }
    };

    const deleteUser = (user) => {
        const updated = savedUsers.filter(u => u !== user);
        setSavedUsers(updated);
        localStorage.setItem('logUsers', JSON.stringify(updated));
    };

    const fetchLogs = async (user = username) => {
        if (!user) return;
        saveUser(user);

        const res = await fetch(`http://localhost:4000/api/jira/logs?username=${user}&range=${range}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        const data = await res.json();
        setLogs(data.logs || []);
    };

    return (
        <div className="logwork-container">
            <h2>Log Geçmişi</h2>

            <div className="controls">
                <input
                    placeholder="Kullanıcı adı (ör: ahmet.tire)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                    <option value="lastWeek">Geçen Hafta</option>
                    <option value="last2Weeks">Geçen 2 Hafta</option>
                </select>
                <button onClick={() => fetchLogs()}>Getir</button>
            </div>

            <div className="saved-users">
                {savedUsers.map(user => (
                    <div key={user}>
                        <button onClick={() => { setUsername(user); fetchLogs(user); }}>{user}</button>
                        <button onClick={() => deleteUser(user)}>✕</button>
                    </div>
                ))}
            </div>

            <div className="log-results">
                {logs.length === 0 && <p>Kayıt bulunamadı.</p>}
                {logs.map((log, index) => (
                    <div key={index} className="log-card">
                        <strong>{log.issueKey}</strong>
                        <div>{log.summary}</div>
                        <div>{log.timeSpent} saat</div>
                        <div>{new Date(log.started).toLocaleDateString('tr-TR')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogWork;
