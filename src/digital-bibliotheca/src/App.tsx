import React from 'react';
import './App.css';
import './styles/Login.css';
import './styles/Registration.css';
import Login from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegForm from './pages/registration';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/registration" element={<RegForm/>} />
        </Routes>
    </div>
  );
}

export default App;
