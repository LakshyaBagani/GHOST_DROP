import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GhostDropSignup from './auth/Signup';
import GhostDropLogin from './auth/Login';
import GhostDropDashboard from './dashboad/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<GhostDropSignup setIsLoggedIn={setIsLoggedIn} />}/>
        <Route path="/login" element={<GhostDropLogin setIsLoggedIn={setIsLoggedIn} />}/>
        <Route path="/" element={<GhostDropDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
