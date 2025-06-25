// src/pages/Daily.jsx
import React, { useEffect, useState } from 'react';
import './Daily.css';

const API_DAILY = 'http://localhost:4000/api/daily';

const Daily = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(API_DAILY)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('GET /api/daily failed:', err));
  }, []);

  const grouped = {};
  data.forEach(entry => {
    const date = new Date(entry.date).toLocaleDateString('tr-TR');
    if (!grouped[date]) grouped[date] = {};
    if(!grouped[date][entry.assign]) grouped[date][entry.assign] = entry.issues;
    else{
        grouped[date][entry.assign] = [...grouped[date][entry.assign],entry.issues]
    }
    
  });

  const dates = Object.keys(grouped);
  const allAssignees = Array.from(
    new Set(data.map(entry => entry.assign))
  );

  return (
    <div className="daily-container">
      <h2>Günlük Kodlama Takibi</h2>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            {allAssignees.map(name => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date}>
              <td>{date}</td>
              {allAssignees.map(name => (
                <td key={name}>
                  {(grouped[date][name] || []).map((i, idx) => (
                    <div key={idx}>
                      <strong>{i.title}</strong>: {i.comments}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Daily;
