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

const App = () => {
  const [text, settext] = useState(" ");
  let msg = new SpeechSynthesisUtterance(text);
  const synth = speechSynthesis;
  const speak = () => {
  synth.speak(msg);
  console.log(msg);
  }
  const stop = () => {
    speechSynthesis.cancel();
  }
  if (!("speechSynthesis" in window && "SpeechSynthesisUtterance" in window)) {
    return "The Speech Synthesis API is not supported in your browser";
  }

  // <SecurityChecks/>
  // <button onClick={speak} className="primary">Speak</button>
  // <button onClick={stop} className="secondary">stop</button>
  // <p>{text}</p>


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin" element={<Private />} >
            <Route path="" element={<Dashboard/>} />
          </Route>
          <Route path="/login" element={<Loginpage />} />
        </Routes>
        <Toaster/>
      </Router>
    </>
  )
}

export default App;