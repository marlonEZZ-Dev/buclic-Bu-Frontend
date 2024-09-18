import { Fragment, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css"; 
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />


        <Route path="/admin/*" element={<AdminPage/>} />

        <Route path="/student/*" element={<StudentPage/>}/>

      </Routes>

      

      
    </ConfigProvider>
  );
}

export default App;
