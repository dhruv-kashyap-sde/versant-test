import React, { useState, useEffect } from 'react';
import './App.css';
import Homepage from './pages/Home/Homepage';
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
import PartB from './components/PartB';
import PartC from './components/PartC';
import Result from './pages/Result/Result';
import Rules from './utils/Rules';
import DeviceWarning from './components/DeviceWarning';

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [speechSupportError, setSpeechSupportError] = useState(null);
  const minDesktopWidth = 1000; // Minimum width for desktop/laptop
  
  // Check for speech API support once on component mount
  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSpeechSupportError("The Speech Synthesis API is not supported in your browser");
      return;
    }
    
    if (!("SpeechSynthesisUtterance" in window)) {
      setSpeechSupportError("The Speech Synthesis API is not fully supported in your browser");
      return;
    }
    
    // Initialize speech synthesis to ensure it's ready when needed
    try {
      // This primes the speech synthesis system to be ready for use
      const voices = speechSynthesis.getVoices();
    } catch (error) {
      console.error("Error initializing speech synthesis:", error);
      setSpeechSupportError("Error initializing speech synthesis");
    }
  }, []);
  
  useEffect(() => {
    // Function to update window width in state
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle speech synthesis API availability errors
  if (speechSupportError) {
    return speechSupportError;
  }

  // Show DeviceWarning if screen width is below minimum desktop width
  if (windowWidth < minDesktopWidth) {
    return <DeviceWarning />;
  }
  
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/admin" element={<Private />} > {/* change it with <Private> later */}
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