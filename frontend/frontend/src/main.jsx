import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importa QueryClient y QueryClientProvider
import './index.css'
// Crea una instancia de QueryClient
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Envuelve toda la aplicación con QueryClientProvider */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);