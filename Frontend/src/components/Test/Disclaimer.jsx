import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Disclaimer.css';

const Disclaimer = ({ onContinue }) => {
  const { 
    speakingVoice, 
    setTestQuestions, 
    loading, 
    setLoading, 
    student, 
    setTestId, 
    capturedImageUrl, 
    base64ToBlob,
    photoTaken
  } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const rules = [
    "Welcome to Versant Test. Please read all instructions carefully before proceeding. Do not reload or refresh the page during the test. DO NOT exit fullscreen mode during the test. Do not block any permissions required for the test. Speak in natural voice, not too low, not too loud. Violating any rules above will lead to instant disqualification from the test.",
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
      setUploadingImage(true);
      let tin = student.tin;

      // Check if photo was taken during security checks
      if (!photoTaken || !capturedImageUrl) {
        toast.error("Security photo is required. Please complete all security checks.");
        setLoading(false);
        setUploadingImage(false);
        return;
      }

      // Create form data with TIN and image
      const formData = new FormData();
      formData.append('tin', tin);
      
      // Convert the base64 image to a blob and add to formData
      try {
        const imageBlob = await base64ToBlob(capturedImageUrl);
        formData.append('image', imageBlob, 'user-photo.png');
      } catch (imgError) {
        toast.error("Failed to process image. Please try again.");
        setLoading(false);
        setUploadingImage(false);
        return;
      }
      
      // Send request with image and TIN
      const response = await axios.post(
        `${import.meta.env.VITE_API}/start`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
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
      setTestId(response.data.testId);
      setLoading(false);
      setUploadingImage(false);
      toast.success(response.data.message);
      onContinue();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error starting test");
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className='disclaimer-container'>
      <div className="disclaimer-body">
        <div className="disclaimer-header">
          <h1>Test Rules & Regulations</h1>
          <p className="subtitle">Please read all instructions carefully before proceeding</p>
        </div>

        <div className="disclaimer-rules-section">
          <div className="rule-card">
            <div className="rule-icon warning">
              <i className="ri-refresh-line"></i>
            </div>
            <div className="rule-content">
              <h3>No Page Reloading</h3>
              <p><strong>DO NOT</strong> refresh or reload the page during the test. This will terminate your test session and may result in disqualification.</p>
            </div>
          </div>

          <div className="rule-card">
            <div className="rule-icon warning">
              <i className="ri-fullscreen-exit-line"></i>
            </div>
            <div className="rule-content">
              <h3>Maintain Fullscreen</h3>
              <p><strong>DO NOT</strong> exit fullscreen mode during the test. Exiting fullscreen may result in disqualification.</p>
            </div>
          </div>

          <div className="rule-card">
            <div className="rule-icon warning">
              <i className="ri-forbid-line"></i>
            </div>
            <div className="rule-content">
              <h3>No Permission Blocking</h3>
              <p><strong>DO NOT</strong> block any permissions required for the test. This includes microphone access which is essential for speaking portions.</p>
            </div>
          </div>

          <div className="rule-card">
            <div className="rule-icon">
              <i className="ri-volume-up-line"></i>
            </div>
            <div className="rule-content">
              <h3>Speaking Volume</h3>
              <p>Speak in a natural voice - not too low, not too loud. Make sure you are in a quiet environment for optimal speech recognition.</p>
            </div>
          </div>

          <div className="rule-card">
            <div className="rule-icon">
              <i className="ri-error-warning-line"></i>
            </div>
            <div className="rule-content">
              <h3>Instant Disqualification</h3>
              <p>Violating any of the rules above will lead to <strong>instant disqualification</strong> from the test. Please adhere to all guidelines.</p>
            </div>
          </div>
        </div>

        <div className="disclaimer-agreement">
          <input 
            onChange={handleCheckboxChange} 
            type="checkbox" 
            name="agreement" 
            checked={isChecked} 
            id="agreement" 
          />
          <label htmlFor="agreement">I have read and understood all the rules and regulations. I agree to comply with them throughout the test.</label>
        </div>
      </div>
      
      <div className="disclaimer-action">
        <button 
          className='primary' 
          disabled={!isChecked || loading || uploadingImage} 
          onClick={handleContinueClick}
        >
          {loading ? "Loading..." : uploadingImage ? "Uploading Photo..." : "Continue to Test"}
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;