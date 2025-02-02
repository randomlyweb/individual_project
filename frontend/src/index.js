import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import Login from './components/LoginForm';
import BlockDetails from './components/BlockDetails';  // Импортируем новый компонент
import ProtectedRoute from './components/protectedRoute';
import FileUpload from './components/FileUpload';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/blocks/:id" element={<ProtectedRoute><BlockDetails /></ProtectedRoute>} />  {/* Новый маршрут */}
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();