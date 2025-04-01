import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Disclaimer = ({ onContinue }) => {
  const { speakingVoice, setTestQuestions, loading, setLoading, student, setTestId } = useContext(AuthContext);
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

  const navigate = useNavigate();
  const handleContinueClick = async () => {
    stop();
    try {
      setLoading(true);
      let tin = student.tin;
      console.log(student);
      
      const response = await axios.post(`${import.meta.env.VITE_API}/start`, { tin });
      console.log(response.data);
      
      if (response.data.status === "completed") {
        toast.error("You have already completed the test. Please check your result.");
        navigate("/");
        return;
      }
      if (response.data.status === "started") {
        toast.error("You are not allowed to take the test. Please contact your instructor.");
        navigate("/");
        return;
      }
      setTestQuestions(response.data.questions);
      console.log(response.data);
      setTestId(response.data.testId);
      setLoading(false);
      toast.success(response.data.message);
      onContinue();
    } catch (error) {
      console.log("Error fetching questions", error);
      toast.error("Error fetching questions");
    } finally{
      setLoading(false);
    }
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
      <button className='primary' disabled={!isChecked} onClick={handleContinueClick}>{loading? "loading":"Continue"}</button>
    </div>
  );
};

export default Disclaimer;