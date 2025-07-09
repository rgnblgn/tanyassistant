import React, { useState, useEffect } from 'react';
import './LogWork.css'
import LogWorkChart from '../components/LogWorkChart';

const LogWork = () => {
    const [username, setUsername] = useState('');
    const [savedUsers, setSavedUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [range, setRange] = useState('lastWeek');
    const [chartData, setChartData] = useState([]);
    const [totalUserHours, settotalUserHours] = useState(0);


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
        // 1. Grup işlemi: issueKey -> [log1, log2, ...]
        const grouped = data.logs.reduce((acc, log) => {
            if (!acc[log.issueKey]) acc[log.issueKey] = [];
            acc[log.issueKey].push(log);
            return acc;
        }, {});

        // 2. Toplam saatleri hesapla
        const prepared = Object.entries(grouped).map(([key, logs]) => ({
            key,
            totalHours: logs.reduce((sum, log) => sum + parseFloat(log.timeSpent), 0)
        }));
        const totalUserHours = prepared.reduce((sum, item) => sum + item.totalHours || 0, 0)
        settotalUserHours(totalUserHours)
        setChartData(prepared);

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


            <div>
                <h2>Loglanmış Saatler : {totalUserHours}</h2>
                <LogWorkChart data={chartData} />
            </div>
        </div>
    );
};

export default LogWork;
