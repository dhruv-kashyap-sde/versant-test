import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Disclaimer = ({ onContinue }) => {
  const { speakingVoice } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState(false);
  
  const rules = [
    "Welcome to Versant Test. Please follow the instructions carefully. Do not reload the page during the test. Do not block any permissions. Do not remove FullScreen. Violating any rules leads to instant disqualification. Speak in natural voice, not too low, not too loud.",
  ];

  const synth = speechSynthesis;
  let msgIndex = 0;
  let msg = new SpeechSynthesisUtterance();
  
  const speak = () => {
    if (msgIndex < rules.length) {
      msg.text = rules[msgIndex];
      msg.voice = speakingVoice;
      synth.speak(msg);
      msgIndex++;
      msg.onend = speak;
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
  };

  useEffect(() => {
    speak();
    return () => {
      stop();
    };
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleContinueClick = () => {
    stop();
    onContinue();
  };

  return (
    <div className='disclaimer-container'>
      <div className="disclaimer-body">
        <div className="disclaimer-header">
          <h1>Rules</h1>
        </div>
        <ol>
          <li>Do not <strong>Reload</strong> the page during the test.</li>
          <li>Do not <strong>Block</strong> any permissions.</li>
          <li>Do not <strong>Remove</strong> FullScreen.</li>
          <li>Voilating any rules leads to instant <strong>DISQUALIFICATION</strong>.</li>
          <li>Speak in Natural voice, not too low, not too loud.</li>
        </ol>
        <label htmlFor="agreement">
          <input 
            onChange={handleCheckboxChange} 
            type="checkbox" 
            name="agreement" 
            checked={isChecked} 
            id="agreement" 
          />
          I agree
        </label>
      </div>
      <button className='primary' disabled={!isChecked} onClick={handleContinueClick}>Continue</button>
    </div>
  );
};

export default Disclaimer;