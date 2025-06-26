// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';

const statusOrder = ['Beklemede', 'Development', 'Test'];
const statusColors = {
  'Test': '#e0e0e0',
  'Beklemede': '#bbdefb',
  'Development': '#ffecb3',
};

const API_DAILY = 'http://localhost:4000/api/daily';

const Dashboard = ({ externalData = [] }) => {
  const [groupedIssues, setGroupedIssues] = useState({});
  const [activeIssues, setActiveIssues] = useState([]);
  const [comment, setCommnet] = useState('');
  const [pComment, postComment] = useState([]);
  const [activeComment, setActiveComment] = useState([[], [], []]);
  const [aktifKodlananlar, setAktifKodlananlar] = useState([]);

  useEffect(() => {
    setAktifKodlananlar([])
    setActiveIssues([])
    const grouped = {};
    statusOrder.forEach(status => (grouped[status] = []));
    externalData.forEach(issue => {
      const status = statusOrder.includes(issue.status) ? issue.status : 'Beklemede';
      grouped[status].push(issue);
    });
    setGroupedIssues(grouped);
  }, [externalData]);

  const handleCardClick = (issue) => {
    if (!activeIssues.find(item => item.id === issue.id)) {
      setActiveIssues([...activeIssues, issue]);
      setActiveComment([...activeComment, []]);

      setAktifKodlananlar(prev => {
        const existing = prev.find(p => p.assign === issue.assignee);
        const newIssue = { title: issue.title, comments: '' };
        if (existing) {
          return prev.map(p =>
            p.assign === issue.assignee
              ? { ...p, issues: [...p.issues, newIssue] }
              : p
          );
        } else {
          return [...prev, { assign: issue.assignee, issues: [newIssue] }];
        }
      });
    }
  };

  const handleDelete = (id) => {
    setActiveIssues(activeIssues.filter(item => item.id !== id));
  };

  const handleComment = (e, id) => {
    postComment([...pComment, comment]);
    setActiveComment(prevItems =>
      prevItems.map((item, index) =>
        index === id ? [...item, comment] : item
      )
    );

    setAktifKodlananlar(prev =>
      prev.map(p => {
        const updatedIssues = p.issues.map((issue, i) => {
          if (activeIssues[id]?.title === issue.title) {
            return { ...issue, comments: comment };
          }
          return issue;
        });
        return { ...p, issues: updatedIssues };
      })
    );
  };

  const handleDailyPost = async () => {
    try {
      for (const block of aktifKodlananlar) {
        const payload = {
          assign: block.assign,
          issues: block.issues,
          date: new Date().toISOString(),
        };

        await fetch(API_DAILY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      alert('Aktif işler MongoDB’ye kaydedildi');
    } catch (error) {
      console.error('POST /api/daily hatası:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {statusOrder.map(status => (
        <div
          key={status}
          className="status-column"
        >
          <h2
            className="status-header"
            style={{ backgroundColor: statusColors[status] }}
          >
            {status}
          </h2>
          <div className="issues-container">
            {groupedIssues[status]?.map(issue => (
              <div
                key={issue.id}
                className="issue-card"
                onClick={() => handleCardClick(issue)}
              >
                <div className="issue-title">{issue.title}</div>
                <div className="issue-assignee">{issue.assignee}</div>
                <div className="issue-updated">
                  Güncellendi: {new Date(issue.updated).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="status-column">
        <h2 className="status-header" style={{ backgroundColor: '#ffe0e0' }}>
          Aktif Kodlanıyor
        </h2>
        <div className="issues-container">
          {activeIssues.map((issue, ind) => (
            <div
              key={issue.id}
              className="issue-card"
            >
              <div className="issue-title">{issue.title}</div>
              <div className="issue-assignee">{issue.assignee}</div>
              {activeComment[ind] && activeComment[ind].map((item, index) => (
                <div key={index} className="issue-assignee">
                  {index + 1}. {item}
                </div>
              ))}
              <div className="issue-updated">
                Güncellendi: {new Date(issue.updated).toLocaleString('tr-TR')}
              </div>
              <textarea onChange={e => setCommnet(e.target.value)} cols="30" rows="5"></textarea>
              <button onClick={(e) => handleComment(e, ind)}>Save post</button>
              <button
                className="delete-button"
                onClick={() => handleDelete(issue.id)}
              >
                Sil
              </button>
            </div>
          ))}
          <button onClick={handleDailyPost} className="gonder-buton">
            Aktif Kodlananları Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;