import React, { useEffect, useState, useContext } from 'react';
import './JiraPage.css'; // İsteğe bağlı stil dosyası
import { AppContext } from '../AppContext';


const API_BASE = 'https://tanyassistant.onrender.com/api';

const statusOrder = ['Beklemede', 'Development', 'Test'];
const statusColors = {
    'Test': '#e0e0e0',
    'Beklemede': '#bbdefb',
    'Development': '#ffecb3'
};
const CreateyourJira = () => {
    const [username, setUsername] = useState('');
    const [savedUsers, setSavedUsers] = useState([]);
    const [groupedIssues, setGroupedIssues] = useState({});
    const [othersComment, setOthersComment] = useState('');
    const [activeIssues, setActiveIssues] = useState([]);
    const [commentMap, setCommentMap] = useState({});
    const [otherNote, setOtherNote] = useState('');
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [statusMapping, setStatusMapping] = useState(() => {
        return JSON.parse(localStorage.getItem('statusMapping')) || {
            'To Do': 'To Do',
            'In Progress': 'In Progress',
            'Code Review': 'Code Review',
            'Done': 'Done'
        };
    });
    const { baseUrl } = useContext(AppContext);

    // Saved usernames DB'den alınır
    useEffect(() => {
        const token = localStorage.getItem('authToken');

        fetch(`${API_BASE}/saved-users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setSavedUsers(data))
            .catch(err => console.error('Kısayol kullanıcılar alınamadı', err));
        fetchStatuses();

    }, []);

    useEffect(() => {

        fetchUserStatusMapping();

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
            await fetch('https://tanyassistant.onrender.com/api/daily', {
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

            await fetch('https://tanyassistant.onrender.com/api/daily', {
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

    const fetchStatuses = async () => {
        let token = localStorage.getItem('authToken')

        const res = await fetch(`https://tanyassistant.onrender.com/api/jira/getAllStatus`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        setAvailableStatuses(data || []);
    }


    // Kullanıcının mapping'ini çek
    const fetchUserStatusMapping = async () => {
        const res = await fetch(`https://tanyassistant.onrender.com/api/jira/status-mapping`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const data = await res.json();
        setStatusMapping(data);
    };

    // Mapping'i kaydet
    const saveUserStatusMapping = async (username, newMapping) => {
        await fetch(`https://tanyassistant.onrender.com/api/jira/status-mapping`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ username, mapping: newMapping }),
        });
    };

    const handleStatusChange = (column, selectedStatus) => {
        const updated = { ...statusMapping, [column]: selectedStatus };
        setStatusMapping(updated);
        saveUserStatusMapping(username, updated);
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
                {Object.keys(statusMapping).map(column => (
                    <div key={column} className="status-column">
                        <div className="status-header">
                            <h3>{column}</h3>
                            <select
                                value={statusMapping[column]}
                                onChange={(e) => handleStatusChange(column, e.target.value)}
                            >
                                {availableStatuses.map((status, i) => (
                                    <option key={i} value={status.name}>{status.name}</option>
                                ))}
                            </select>
                        </div>

                        {groupedIssues[statusMapping[column]]?.map(issue => (
                            <div key={issue.id} className="issue-card">
                                <strong>
                                    <a
                                        href={`${API_BASE}/browse/${issue.key}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {issue.key}
                                    </a>
                                </strong>
                                <div>{issue.fields.assignee?.displayName}</div>
                                <div>{issue.fields.summary}</div>
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
                                href={`${baseUrl}/browse/${issue.key}`}
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

export default CreateyourJira;
