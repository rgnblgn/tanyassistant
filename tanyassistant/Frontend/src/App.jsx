// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Meeting from './pages/Meeting';
import Daily from './pages/Daily';

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '16px' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Anasayfa</Link>
        <Link to="/meeting" style={{ marginRight: '20px' }}>Meeting</Link>
        <Link to="/daily">Daily</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/daily" element={<Daily />} />
      </Routes>
    </Router>
  );
};

export default App;
