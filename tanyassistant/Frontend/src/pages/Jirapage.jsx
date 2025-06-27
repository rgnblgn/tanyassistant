import React, { useEffect, useState } from 'react';
import './JiraPage.css'; // İsteğe bağlı stil dosyası

const API_BASE = 'http://localhost:4000/api';

const statusOrder = ['Beklemede', 'Development', 'Test'];
const statusColors = {
    'Test': '#e0e0e0',
    'Beklemede': '#bbdefb',
    'Development': '#ffecb3'
};
const JiraPage = () => {
    const [username, setUsername] = useState('');
    const [savedUsers, setSavedUsers] = useState([]);
    const [groupedIssues, setGroupedIssues] = useState({});

    // Saved usernames DB'den alınır
    useEffect(() => {
        fetch(`${API_BASE}/saved-users`)
            .then(res => res.json())
            .then(data => setSavedUsers(data))
            .catch(err => console.error('Kısayol kullanıcılar alınamadı', err));
    }, []);

    const fetchUserIssues = async (name) => {
        try {
            const res = await fetch(`${API_BASE}/jira/getUserIssues?username=${name}`);
            const data = await res.json();

            const grouped = {};
            statusOrder.forEach(status => grouped[status] = []);
            data?.issues.forEach(issue => {
                const status = statusOrder.includes(issue.status) ? issue.status : 'Beklemede';
                grouped[status].push(issue);
            });

            setGroupedIssues(grouped);
        } catch (error) {
            console.error('Issue çekme hatası:', error);
        }
    };

    const deleteUser = async (username) => {
        if (!window.confirm(`${username} silinsin mi?`)) return;

        try {
            await fetch(`${API_BASE}/saved-users/${username}`, {
                method: 'DELETE',
            });
            setSavedUsers(prev => prev.filter(u => u !== username));
        } catch (err) {
            console.error('Silme hatası:', err);
        }
    };

    const handleSearch = async () => {
        await fetchUserIssues(username);

        // DB'ye kullanıcıyı POST et
        await fetch(`${API_BASE}/saved-users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        // Yeni kullanıcıyı hemen göster
        setSavedUsers(prev => [...new Set([...prev, username])]);
        setUsername('');
    };

    return (
        <div className="user-issues-container">
            <h2>Kullanıcıya Ait Issue'lar</h2>

            <div className="user-search">
                <input
                    type="text"
                    placeholder="Kullanıcı adı girin (ör: ahmet.tire)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={handleSearch}>Getir</button>
            </div>

            <div className="saved-users">
                {savedUsers.map((user, i) => (
                    <div key={'users'+i}>
                        <button key={'buttons'+i} onClick={() => fetchUserIssues(user)}>
                            {user}
                        </button>
                        <button className="delete-btn" onClick={() => deleteUser(user)}>✕</button>
                    </div>
                ))}
            </div>

            <div className="issues-columns">
                {statusOrder.map(status => (
                    <div key={status} className="status-column">
                        <h3 style={{ backgroundColor: statusColors[status] }}>{status}</h3>
                        {groupedIssues[status]?.map(issue => (
                            <div key={issue.id} className="issue-card">
                                <strong>{issue.key}</strong>
                                <div>{issue.fields.assignee.name}</div>
                                <div>{issue.fields.summary}</div>

                                <div>{issue.fields.description}</div>
                                <div>{issue.assignee}</div>
                                <div>{new Date(issue.fields.updated).toLocaleString('tr-TR')}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JiraPage;
