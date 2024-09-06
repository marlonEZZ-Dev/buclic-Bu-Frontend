import { Fragment, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css'; // Asegúrate de importar los estilos de Ant Design

function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
