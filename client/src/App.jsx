import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GhostDropSignup from './auth/Signup'
import GhostDropLogin from './auth/Login'
import GhostDropDashboard from './dashboad/Dashboard';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<GhostDropDashboard/>}/>
              <Route path="/login" element={<GhostDropLogin/>}/>
              <Route path="/signup" element={<GhostDropSignup/>}/>
          </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App