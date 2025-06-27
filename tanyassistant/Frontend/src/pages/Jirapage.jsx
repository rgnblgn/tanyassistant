import React, { useState } from 'react';

const JiraPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGetMyIssues = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/jira/my-issues');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Bir hata oluştu.');
    }
  };

  const getUserIssues = async (userName) => {
    try {
      const res = await fetch('http://localhost:4000/api/jira/getUserIssues?userName='+userName);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Bir hata oluştu.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Jira API Test</h2>
      <button onClick={handleGetMyIssues}>Benim Üzerimdeki İşleri Getir</button>
      <button onClick={()=>getUserIssues('enes.karatas')}>Başkasının işini getir</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <pre style={{ background: '#f5f5f5', padding: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default JiraPage;
