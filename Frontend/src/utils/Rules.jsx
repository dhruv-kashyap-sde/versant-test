import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Tutorial.css';

const Rules = ({ inTest, back }) => {
  const [micPermission, setMicPermission] = useState('unchecked');
  const [fullscreenSupport, setFullscreenSupport] = useState('unchecked');
  const [speechSynthesisSupport, setSpeechSynthesisSupport] = useState('unchecked');
  const [speechRecognitionSupport, setSpeechRecognitionSupport] = useState('unchecked');

  const navigate = useNavigate();

  useEffect(() => {
    // Check speech synthesis support
    if ('speechSynthesis' in window) {
      setSpeechSynthesisSupport('supported');
    } else {
      setSpeechSynthesisSupport('not-supported');
    }

    // Check speech recognition support
    const hasSpeechRecognition = 'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window || 
      'mozSpeechRecognition' in window || 
      'msSpeechRecognition' in window;
    
    if (hasSpeechRecognition) {
      setSpeechRecognitionSupport('supported');
    } else {
      setSpeechRecognitionSupport('not-supported');
    }

    // Check fullscreen support
    if (document.documentElement.requestFullscreen || 
        document.documentElement.webkitRequestFullscreen || 
        document.documentElement.msRequestFullscreen) {
      setFullscreenSupport('supported');
    } else {
      setFullscreenSupport('not-supported');
    }
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      setMicPermission('checking');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check if we got audio tracks
      if (stream.getAudioTracks().length > 0) {
        setMicPermission('granted');
      } else {
        setMicPermission('denied');
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicPermission('denied');
    }
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => console.log('Fullscreen enabled'))
        .catch(err => console.error('Error enabling fullscreen:', err));
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  return (
    <div className="rules-container">
      <div className="rules-header">
        <h1>Test Guide & Requirements</h1>
        <p className="subtitle">Please read all instructions carefully before starting the test</p>
      </div>

      <div className="rules-section">
        <h2>Browser Requirements</h2>
        <div className="rule-card">
          <div className="rule-icon">
            <i className="ri-chrome-line"></i>
          </div>
          <div className="rule-content">
            <h3>Supported Browsers</h3>
            <p>This test is optimized for <strong>Google Chrome</strong> and <strong>Microsoft Edge</strong>. Other browsers are not recommended as they may not support all the required features.</p>
          </div>
        </div>
      </div>

      <div className="rules-section">
        <h2>System Requirements</h2>

        <div className="rule-card">
          <div className="rule-icon">
            <i className="ri-mic-line"></i>
          </div>
          <div className="rule-content">
            <h3>Microphone Access</h3>
            <p>You must allow microphone access to complete the speaking portions of the test.</p>
            <div className="rule-action">
              <button 
                onClick={checkMicrophonePermission} 
                className={`check-button ${micPermission}`}
              >
                {micPermission === 'unchecked' && "Check Microphone Access"}
                {micPermission === 'checking' && "Checking..."}
                {micPermission === 'granted' && "✓ Microphone Access Granted"}
                {micPermission === 'denied' && "✗ Microphone Access Denied"}
              </button>
              {micPermission === 'denied' && (
                <div className="permission-help">
                  <p>Please check your browser settings and ensure microphone access is allowed.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rule-card">
          <div className="rule-icon">
            <i className="ri-fullscreen-line"></i>
          </div>
          <div className="rule-content">
            <h3>Fullscreen Mode</h3>
            <p>The test will be conducted in fullscreen mode to minimize distractions.</p>
            <div className="rule-action">
              <button 
                onClick={requestFullscreen} 
                className={`check-button ${fullscreenSupport}`}
                disabled={fullscreenSupport === 'not-supported'}
              >
                {fullscreenSupport === 'supported' && "Test Fullscreen Mode"}
                {fullscreenSupport === 'not-supported' && "Fullscreen Not Supported"}
              </button>
              {fullscreenSupport === 'not-supported' && (
                <div className="permission-help">
                  <p>Your browser doesn't support fullscreen mode. Please use Chrome or Edge.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rule-card">
          <div className="rule-icon">
            <i className="ri-volume-up-line"></i>
          </div>
          <div className="rule-content">
            <h3>Speech Synthesis Support</h3>
            <p>Your browser must support speech synthesis for the test to function properly.</p>
            <div className="rule-status">
              {speechSynthesisSupport === 'supported' ? (
                <span className="status-supported">✓ Your browser supports Speech Synthesis</span>
              ) : (
                <span className="status-not-supported">✗ Your browser doesn't support Speech Synthesis</span>
              )}
            </div>
          </div>
        </div>

        <div className="rule-card">
          <div className="rule-icon">
            <i className="ri-record-circle-line"></i>
          </div>
          <div className="rule-content">
            <h3>Speech Recognition Support</h3>
            <p>Your browser must support speech recognition for the test to function properly.</p>
            <div className="rule-status">
              {speechRecognitionSupport === 'supported' ? (
                <span className="status-supported">✓ Your browser supports Speech Recognition</span>
              ) : (
                <span className="status-not-supported">✗ Your browser doesn't support Speech Recognition</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rules-section">
        <h2>Important Test Rules</h2>
        
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
            <i className="ri-time-line"></i>
          </div>
          <div className="rule-content">
            <h3>Time Management</h3>
            <p>Each section of the test has specific time limits. Make sure to complete each section within the allocated time.</p>
          </div>
        </div>
      </div>

      <div className="rules-section parts-section">
        <h2>Test Components Overview</h2>
        
        <div className="rule-card">
            <span className="circle">A</span>
          <div className="rule-content no-icon">
            <h3> Sentence Repetition</h3>
            <p>You will hear sentences and need to repeat them exactly as you hear them.</p>
          </div>
        </div>
        
        <div className="rule-card">
            <span className="circle">B</span>
          <div className="rule-content no-icon">
            <h3> Sentence Builds</h3>
            <p>You will hear three short phrases and need to arrange them into a grammatically correct sentence.</p>
          </div>
        </div>
        
        <div className="rule-card">
            <span className="circle">C</span>
          <div className="rule-content no-icon">
            <h3> Conversations</h3>
            <p>You will listen to a conversation between two speakers and answer a comprehension question.</p>
          </div>
        </div>
        
        <div className="rule-card">
            <span className="circle">D</span>
          <div className="rule-content no-icon">
            <h3> Sentence Completion</h3>
            <p>You will read sentences with missing words and supply appropriate words to complete them.</p>
          </div>
        </div>
        
        <div className="rule-card">
            <span className="circle">E</span>
          <div className="rule-content no-icon">
            <h3> Dictation</h3>
            <p>You will hear sentences and need to type them exactly as you hear them.</p>
          </div>
        </div>
        
        <div className="rule-card">
            <span className="circle">F</span>
          <div className="rule-content no-icon">
            <h3> Passage Reconstruction</h3>
            <p>You will view a short passage for 30 seconds, after which you'll need to reconstruct it from memory.</p>
          </div>
        </div>
      </div>

      <div className="rules-action">
        {inTest ? <><button onClick={back} className="secondary">Go Back</button> <button onClick={() => navigate('/start-test')} className="primary">Continue</button></>:
        <Link to="/" className="">Return to Homepage</Link>
        }
      </div>
    </div>
  );
};

export default Rules;