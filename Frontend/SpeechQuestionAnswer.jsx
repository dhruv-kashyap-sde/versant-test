import React, { useEffect, useState, useRef } from 'react';

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
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        storeAnswer(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setSpeechStatus('idle');
        clearTimeout(timerRef.current);
        
        // Move to next question if we have more
        if (currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
          }, 1000);
        } else {
          // // console.log("All questions completed. Answers:", answers);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setSpeechStatus('idle');
      };
    } else {
      console.error("Speech recognition not supported");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      clearTimeout(timerRef.current);
    };
  }, []);
  
  // Start the process when component mounts or when currentQuestionIndex changes
  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      speakQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex]);
  
  const speakQuestion = (text) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setSpeechStatus('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      setSpeechStatus('listening');
      startListening();
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error", event);
      setSpeechStatus('idle');
    };
    
    speechSynthesis.speak(utterance);
  };
  
  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        
        // Set a timeout to stop listening after 10 seconds
        timerRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
          }
        }, 10000);
      } catch (error) {
        console.error("Error starting speech recognition", error);
      }
    }
  };
  
  const storeAnswer = (answer) => {
    setAnswers(prev => [...prev, {
      question: questions[currentQuestionIndex],
      answer
    }]);
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
