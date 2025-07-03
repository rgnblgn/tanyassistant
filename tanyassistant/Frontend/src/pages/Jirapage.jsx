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
    const [othersComment, setOthersComment] = useState('');
    const [activeIssues, setActiveIssues] = useState([]);
    const [commentMap, setCommentMap] = useState({});
    const [otherNote, setOtherNote] = useState('');


    // Saved usernames DB'den alınır
    useEffect(() => {
        fetch(`${API_BASE}/saved-users`)
            .then(res => res.json())
            .then(data => setSavedUsers(data))
            .catch(err => console.error('Kısayol kullanıcılar alınamadı', err));
    }, []);

    const handleIssueClick = (issue) => {
        if (!activeIssues.find(item => item.id === issue.id)) {
            setActiveIssues([...activeIssues, issue]);
            setCommentMap(prev => ({ ...prev, [issue.id]: '' }));
        }
    };

    const handleOtherNoteSubmit = async () => {
        if (!username || !otherNote.trim()) return alert("Kullanıcı adı veya not boş olamaz.");

        const payload = {
            assign: username,
            issues: [
                {
                    title: 'Diğer Not',
                    comments: otherNote.trim()
                }
            ],
            date: new Date().toISOString()
        };

        try {
            await fetch('http://localhost:4000/api/daily', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert('Diğer not MongoDB’ye kaydedildi');
            setOtherNote('');
        } catch (err) {
            console.error('Diğer not POST hatası:', err);
        }
    };


    const handleCommentChange = (id, value) => {
        setCommentMap(prev => ({ ...prev, [id]: value }));
    };


    const handleSubmit = async () => {
        const grouped = {};

        activeIssues.forEach(issue => {
            const assign = issue.fields.assignee?.name || 'Bilinmiyor';
            if (!grouped[assign]) grouped[assign] = [];
            grouped[assign].push({
                title: issue.fields.summary,
                comments: commentMap[issue.id] || '',
                key: issue.key
            });
        });

        for (const [assign, issues] of Object.entries(grouped)) {
            // othersComment varsa bu assign'a ekle
            const payload = {
                assign,
                issues: [...issues],
                date: new Date().toISOString()
            };

            if (othersComment.trim()) {
                payload.issues.push({
                    title: 'Genel Not',
                    comments: othersComment.trim()
                });
            }

            await fetch('http://localhost:4000/api/daily', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        alert('Gönderildi');
        setActiveIssues([]);
        setCommentMap({});
        setOthersComment('');
    };



    const fetchUserIssues = async (name) => {
        let token = localStorage.getItem('authToken')
        setUsername(name);
        try {
            const res = await fetch(`${API_BASE}/jira/getUserIssues?username=${name}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            const grouped = {};
            statusOrder.forEach(status => grouped[status] = []);
            data?.issues.forEach(issue => {
                const status = statusOrder.includes(issue.fields.status.name) ? issue.fields.status.name : 'Beklemede';
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

    const handleDelete = (id) => {
        setActiveIssues(activeIssues.filter(item => item.id !== id));
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
                    <div key={'users' + i}>
                        <button key={'buttons' + i} onClick={() => fetchUserIssues(user)}>
                            {user}
                        </button>
                        <button className="delete-btn" onClick={() => deleteUser(user)}>✕</button>
                    </div>
                ))}
            </div>

            <div className="issues-columns">
                {statusOrder.map(status => (
                    <div key={status} className="status-column">
                        <h3 style={{ backgroundColor: statusColors[status] }}>
                            {status} / {groupedIssues[status]?.length}
                        </h3>
                        {groupedIssues[status]?.map(issue => (
                            <div
                                key={issue.id}
                                className="issue-card"
                                onClick={() => handleIssueClick(issue)}
                            >
                                <strong>{issue.key}</strong>
                                <div>{issue.fields.assignee.name}</div>
                                <div>{issue.fields.summary}</div>
                                <div>{issue.fields.description}</div>
                                <div>{new Date(issue.fields.updated).toLocaleString('tr-TR')}</div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Aktif Kodlanıyor Alanı */}
                <div className="status-column active-coding">
                    <h3 style={{ backgroundColor: '#fff8dc' }}>Aktif Kodlanıyor</h3>
                    {activeIssues.map(issue => (
                        <div key={issue.id} className="issue-card">
                            <a
                                href={`${import.meta.env.VITE_API_URL}/browse/${issue.key}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <strong>{issue.key}</strong>
                            </a>
                            <div>{issue.fields.assignee.name}</div>
                            <div>{issue.fields.summary}</div>
                            <textarea
                                value={commentMap[issue.id] || ''}
                                onChange={e => handleCommentChange(issue.id, e.target.value)}
                                rows="3"
                                placeholder="Yorum girin"
                            />
                            <button onClick={() => handleDelete(issue.id)}>Sil</button>
                        </div>
                    ))}
                    <div className="other-note-box">
                        <h4>Diğer Notlar</h4>
                        <textarea
                            rows="4"
                            placeholder="Bu kullanıcıya ait ek notlar..."
                            value={otherNote}
                            onChange={(e) => setOtherNote(e.target.value)}
                        />
                        <button onClick={handleOtherNoteSubmit}>Gönder</button>
                    </div>
                    {activeIssues.length > 0 && (
                        <button onClick={handleSubmit} className="gonder-buton">
                            Aktif Kodlananları Gönder
                        </button>
                    )}

                </div>
            </div>
        </div>
    );

};

export default JiraPage;
