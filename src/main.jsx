import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { loadConfig } from './api'; // Importa la función loadConfig

const container = document.getElementById('root');
const root = createRoot(container);

// Llamamos a loadConfig antes de montar la aplicación
loadConfig()
  .then(() => {
    root.render(
      <BrowserRouter basename='/bienestar'>
        <App />
      </BrowserRouter>
    );
  })
  .catch((error) => {
    console.error("Error inicializando la configuración:", error);

    // Muestra un mensaje de error en el DOM
    container.innerHTML = '<h1>Error cargando la configuración de la aplicación.</h1>';
  });
