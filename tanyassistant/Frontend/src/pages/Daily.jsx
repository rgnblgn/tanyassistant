// src/pages/Daily.jsx
import React, { useEffect, useState } from 'react';
import './Daily.css';

const API_DAILY = 'http://localhost:4000/api/daily';

const Daily = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(API_DAILY)
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error('GET /api/daily failed:', err));
  }, []);

  const groupByDate = {};
  records.forEach(record => {
    const date = new Date(record.date).toLocaleDateString('tr-TR');
    if (!groupByDate[date]) groupByDate[date] = [];
    groupByDate[date].push(record);
  });

  const uniqueAssigns = Array.from(new Set(records.map(r => r.assign)));

  const handleDeleteGroup = (date) => {
    const toDelete = groupByDate[date];
    Promise.all(
      toDelete.map(rec =>
        fetch(`${API_DAILY}/${rec._id}`, {
          method: 'DELETE'
        })
      )
    )
      .then(() => {
        setRecords(records.filter(r => new Date(r.date).toLocaleDateString('tr-TR') !== date));
      })
      .catch(err => console.error('DELETE group failed:', err));
  };

  return (
    <div className="daily-container">
      <h2>Günlük Aktif Kodlama Takibi</h2>
      <table className="daily-table">
        <thead>
          <tr>
            <th>Tarih</th>
            {uniqueAssigns.map(assign => (
              <th key={assign}>{assign}</th>
            ))}
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupByDate).map(([date, group]) => (
            <tr key={date}>
              <td>{date}</td>
              {uniqueAssigns.map(assign => (
                <td key={assign}>
                  {group
                    .filter(g => g.assign === assign)
                    .flatMap(g => g.issues)
                    .map((i, idx) => (
                      <div key={idx} className="issue-block">
                        <a
                          href={`${import.meta.env.VITE_API_URL}/browse/${i.key}`}
                          target="_blank"
                        >
                          <strong>{i.key} </strong>
                        </a>
                        <strong>{i.title}</strong>
                        <div>{i.comments}</div>
                      </div>
                    ))}
                </td>
              ))}
              <td>
                <button className="delete-button" onClick={() => handleDeleteGroup(date)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Daily;
