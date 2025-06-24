// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Meeting from './pages/Meeting';

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '16px' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Anasayfa</Link>
        <Link to="/meeting">Meeting</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting" element={<Meeting />} />
      </Routes>
    </Router>
  );
};

export default App;
