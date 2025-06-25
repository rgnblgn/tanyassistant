import React, { useState } from 'react';
import CsvUpload from '../components/CsvUpload';
import Dashboard from '../components/Dashboard';

const Home = () => {
  const [issues, setIssues] = useState([]);

  return (
    <div>
      <CsvUpload onDataParsed={setIssues} />
      {issues.length > 0 && <Dashboard externalData={issues} />}
    </div>
  );
};

export default Home;
