import React, { useState, useEffect } from 'react';
import Homepage from './pages/Home/Homepage';
import Dashboard from './components/Dashboard/AdminDashboard/Dashboard';
import Private from './utils/private';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Loginpage from './pages/Login/Login';
import NotFound from './pages/404/404';
import { Toaster } from 'react-hot-toast';
import StartTest from './components/Test/StartTest';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
// import PartD from './components/PartD';
// import PartE from './components/PartE';
// import PartF from './components/PartF';
// import PartA from './components/PartA';
// import PartB from './components/PartB';
// import PartC from './components/PartC';
import Rules from './utils/Rules';
import DeviceWarning from './components/DeviceWarning';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme/theme'; 
import TrainerDashboard from './components/Dashboard/TrainerDashboard/TrainerDashboard';


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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/admin" element={<Private />} > {/* change it with <Private> later */}
                <Route path="" element={<Dashboard />} />
              </Route>
              <Route path="/trainer" element={<Private />} > {/* change it with <Private> later */}
                <Route path="" element={<TrainerDashboard />} />
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
              <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App;