import React, { useEffect, useState, useRef, useCallback } from 'react';

const SpeechQuestionAnswer = () => {
  const [questions, setQuestions] = useState([
    "What is your name?",
    "How old are you?",
    "Where are you from?",
    // Add more questions as needed
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('idle'); // 'idle', 'speaking', 'listening'
  
  const speechSynthesis = window.speechSynthesis;
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true); // Track if component is mounted
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        if (!isMountedRef.current) return; // Guard against unmounted component
        
        const transcript = event.results[0][0].transcript;
        storeAnswer(transcript);
      };
      
      recognitionRef.current.onend = () => {
        if (!isMountedRef.current) return; // Guard against unmounted component
        
        setIsListening(false);
        setSpeechStatus('idle');
        
        // Clear any existing timeout to prevent memory leaks
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        // Move to next question if we have more
        if (currentQuestionIndex < questions.length - 1) {
          const nextQuestionTimeout = setTimeout(() => {
            if (isMountedRef.current) { // Only proceed if component is still mounted
              setCurrentQuestionIndex(prev => prev + 1);
            }
          }, 1000);
          
          // Store the timeout ref for cleanup
          timerRef.current = nextQuestionTimeout;
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        if (!isMountedRef.current) return; // Guard against unmounted component
        
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setSpeechStatus('idle');
        
        // Clear any existing timeout
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      console.error("Speech recognition not supported");
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false; // Mark component as unmounted
      
      // Cancel any ongoing speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error("Error aborting speech recognition:", error);
        }
      }
      
      // Cancel any ongoing speech synthesis
      if (speechSynthesis && speechSynthesis.speaking) {
        try {
          speechSynthesis.cancel();
        } catch (error) {
          console.error("Error canceling speech synthesis:", error);
        }
      }
      
      // Clear any active timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  
  // Safe function to handle state updates - prevents race conditions
  const storeAnswer = useCallback((answer) => {
    if (!isMountedRef.current) return;
    
    setAnswers(prev => [
      ...prev, 
      {
        question: questions[currentQuestionIndex],
        answer
      }
    ]);
  }, [questions, currentQuestionIndex]);
  
  // Start the process when component mounts or when currentQuestionIndex changes
  useEffect(() => {
    // Only proceed if component is mounted
    if (!isMountedRef.current) return;
    
    if (currentQuestionIndex < questions.length) {
      const speakTimeout = setTimeout(() => {
        if (isMountedRef.current) { // Verify component is still mounted
          speakQuestion(questions[currentQuestionIndex]);
        }
      }, 300); // Small delay to prevent race conditions
      
      timerRef.current = speakTimeout;
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, questions]);
  
  const speakQuestion = (text) => {
    if (!isMountedRef.current) return;
    
    // Cancel any ongoing speech
    if (speechSynthesis.speaking) {
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.error("Error canceling speech:", error);
      }
    }
    
    setSpeechStatus('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      if (!isMountedRef.current) return;
      
      setSpeechStatus('listening');
      // Small delay before starting listening to prevent race conditions
      setTimeout(() => {
        if (isMountedRef.current) {
          startListening();
        }
      }, 100);
    };
    
    utterance.onerror = (event) => {
      if (!isMountedRef.current) return;
      
      console.error("Speech synthesis error", event);
      setSpeechStatus('idle');
    };
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error speaking:", error);
      setSpeechStatus('idle');
    }
  };
  
  const startListening = () => {
    if (!recognitionRef.current || !isMountedRef.current) return;
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set a timeout to stop listening after 10 seconds
      timerRef.current = setTimeout(() => {
        if (isMountedRef.current && recognitionRef.current && isListening) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.error("Error stopping speech recognition:", error);
          }
        }
      }, 10000);
    } catch (error) {
      console.error("Error starting speech recognition", error);
      setSpeechStatus('idle');
      setIsListening(false);
    }
  };
  
  return (
    <div className="speech-qa-container">
      <h2>Speech Question and Answer</h2>
      
      <div className="status-indicator">
        {speechStatus === 'speaking' && <p>Speaking: "{questions[currentQuestionIndex]}"</p>}
        {speechStatus === 'listening' && <p>Listening... (10 seconds)</p>}
        {speechStatus === 'idle' && currentQuestionIndex < questions.length && 
          <p>Getting ready for next question...</p>}
        {currentQuestionIndex >= questions.length && <p>All questions completed!</p>}
      </div>
      
      <div className="answers-display">
        <h3>Recorded Answers:</h3>
        <ul>
          {answers.map((item, index) => (
            <li key={index}>
              <strong>Q: {item.question}</strong><br/>
              A: {item.answer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpeechQuestionAnswer;
