import React, { useState } from 'react';
import './App.css';
import Homepage from './pages/Home/Homepage';
import SpeechToText from './utils/SpeechToText';
import SecurityChecks from './security/SecurityChecks';
import TestContainer from './utils/SpeechToText';
import Dashboard from './components/Dashboard/Dashboard';
import Private from './utils/private';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Loginpage from './pages/Login/Login';
import { Toaster } from 'react-hot-toast';
import StartTest from './components/Test/StartTest';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import PartD from './components/PartD';
import PartE from './components/PartE';
import PartF from './components/PartF';
import PartA from './components/PartA';

const App = () => {
  if (!("speechSynthesis" in window && "SpeechSynthesisUtterance" in window)) {
    return "The Speech Synthesis API is not supported in your browser";
  }

  // <SecurityChecks/>
  // <button onClick={speak} className="primary">Speak</button>
  // <button onClick={stop} className="secondary">stop</button>
  // <p>{text}</p>
  
  return (
    <>
        <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PartA />} />
          <Route path="/admin" element={<Private />} >
            <Route path="" element={<Dashboard/>} />
          </Route>
          <Route path="/login" element={<Loginpage />} />
          <Route
            path="/start-test"
            element={
              <ProtectedRoute>
                <StartTest />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster/>
      </Router>
      </AuthProvider>      
    </>
  )
}

export default App;