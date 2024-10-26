import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import JoiningForm from './components/Forms/JoiningForm'; 
import './App.css'
import Login from './components/Forms/Login';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/joiningform" element={<JoiningForm />} />
    </Routes>
  </Router>
  
  );
}

export default App
