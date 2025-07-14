import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { BaseUrlProvider } from './AppContext.jsx';


createRoot(document.getElementById('root')).render(
  <Router>
    <StrictMode>
      <BaseUrlProvider>
        <App />
      </BaseUrlProvider>
    </StrictMode>
  </Router>,
)
