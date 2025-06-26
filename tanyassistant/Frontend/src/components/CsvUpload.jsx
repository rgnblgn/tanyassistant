import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvUpload = ({ onDataParsed }) => {
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('CSV dosyası okunamadı.');
          console.error(results.errors);
        } else {
          const mapped = results.data.map((row, index) => ({
            id: row['Issue key'] || `ROW-${index}`,
            title: row['Summary'] || 'Başlıksız',
            status: row['Status'] || 'To Do',
            assignee: row['Assignee'] || 'Bilinmiyor',
            updated: new Date(row['Updated']).toISOString(),
            type: row['Issue Type'] || 'Task',
          }));
          onDataParsed(mapped);
          setError('');
        }
      },
    });
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-semibold">Jira CSV Dosyası Yükle:</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-2"
      />
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default CsvUpload;
