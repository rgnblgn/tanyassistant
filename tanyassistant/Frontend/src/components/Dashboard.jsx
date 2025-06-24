// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';

const statusOrder = ['Beklemede', 'Development', 'Test'];
const statusColors = {
  'Test': '#e0e0e0',
  'Beklemede': '#bbdefb',
  'Development': '#ffecb3',

};

const Dashboard = ({ externalData = [] }) => {
  const [groupedIssues, setGroupedIssues] = useState({});
  const [activeIssues, setActiveIssues] = useState([]);
  const [comment, setCommnet] = useState('');
  const [pComment, postComment] = useState([]);
  const [activeComment, setActiveComment] = useState([[],[],[]]);

  useEffect(() => {
    const grouped = {};
    statusOrder.forEach(status => (grouped[status] = []));
    externalData.forEach(issue => {
      const status = statusOrder.includes(issue.status) ? issue.status : 'Beklemede';
      grouped[status].push(issue);
    });
    setGroupedIssues(grouped);
  }, [externalData]);

  const handleCardClick = (issue) => {
    // Aktif kolonda aynı ID varsa tekrar ekleme
    if (!activeIssues.find(item => item.id === issue.id)) {
      setActiveIssues([...activeIssues, issue]);
      setActiveComment([...activeComment,[]])
    }
  };

  const handleDelete = (id) => {
    setActiveIssues(activeIssues.filter(item => item.id !== id));
  };

  const handleComment = (e,id) => {
    console.log(id)
    postComment([...pComment, comment])
    setActiveComment(prevItems => prevItems.map((item,index)=>{
       if(index===id) return [...item,comment]
       return item
    }))
    
  };

  const toggleSelected = (id) => {
  setItems(prevItems =>
    prevItems.map(item =>
      item.id === id
        ? { ...item, selected: true }  // sadece istediğin alanı değiştir
        : item
    )
  );
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
          {activeIssues.map((issue,ind) => (
            <div
              key={issue.id}
              className="issue-card"
            >
              <div className="issue-title">{issue.title}</div>
              <div className="issue-assignee">{issue.assignee}</div>
              {activeComment[ind] && activeComment[ind].map((item, index) => {
                return <div className="issue-assignee">{index + 1}. {item}</div>
              })}

              <div className="issue-updated">
                Güncellendi: {new Date(issue.updated).toLocaleString('tr-TR')}
              </div>
              <textarea onChange={e => setCommnet(e.target.value)} name="" id="new-comment" cols="30" rows="5"></textarea>
              <button onClick={(e)=>handleComment(e,ind)}>Save post</button>
              <button
                className="delete-button"
                onClick={() => handleDelete(issue.id)}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
