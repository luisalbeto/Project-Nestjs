// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// Importa otras páginas como Dashboard, Projects, etc.

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Agrega otras rutas aquí */}
      {/* Ejemplo: */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
};

export default App;
