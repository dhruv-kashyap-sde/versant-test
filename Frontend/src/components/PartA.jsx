import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import Tutorial from "../utils/Tutorial";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const PartA = ({ onContinue }) => {
  const { speakingVoice, updatePartScore, totalScore, testQuestions } =
    useContext(AuthContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("idle"); // 'idle', 'speaking', 'listening'
  const questions = testQuestions.partA;
  const speechSynthesis = window.speechSynthesis;
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true); // Track component mount status

  // Initialize speech recognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        if (!isMountedRef.current) return; // Prevent state updates if unmounted
        
        const transcript = event.results[0][0].transcript;
        updatePartScore("A", transcript);
      };

      recognitionRef.current.onend = () => {
        if (!isMountedRef.current) return; // Prevent state updates if unmounted
        
        setIsListening(false);
        setSpeechStatus("idle");
        
        // Clear any existing timeout to prevent memory leaks
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        // Move to next question if we have more
        if (currentQuestionIndex < questions.length - 1) {
          const nextTimeout = setTimeout(() => {
            if (isMountedRef.current) { // Check if still mounted
              setCurrentQuestionIndex((prev) => prev + 1);
            }
          }, 1000);
          
          timerRef.current = nextTimeout;
        }
      };

      recognitionRef.current.onerror = () => {
        if (!isMountedRef.current) return; // Prevent state updates if unmounted
        
        updatePartScore("A", ""); // Store empty string for no answer
        setIsListening(false);
        setSpeechStatus("idle");
        
        // Clear any existing timeout
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      toast.error(
        "Speech recognition not supported in this browser. Please use Chrome or Microsoft Edge."
      );
      console.error("Speech recognition not supported");
    }

    return () => {
      isMountedRef.current = false; // Mark as unmounted
      
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

  // Start the process when component mounts or when currentQuestionIndex changes
  useEffect(() => {
    if (inTutorial || !isMountedRef.current) return;

    if (currentQuestionIndex < questions.length) {
      // Add small delay to prevent race conditions
      const speakTimeout = setTimeout(() => {
        if (isMountedRef.current) { // Check if component is still mounted
          speakQuestion(questions[currentQuestionIndex].question);
        }
      }, 300);
      
      timerRef.current = speakTimeout;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, inTutorial]);

  const speakQuestion = useCallback((text) => {
    if (!isMountedRef.current) return;
    
    // Cancel any ongoing speech
    if (speechSynthesis.speaking) {
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.error("Error canceling speech:", error);
      }
    }

    setSpeechStatus("speaking");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speakingVoice;
    
    utterance.onend = () => {
      if (!isMountedRef.current) return;
      
      setSpeechStatus("listening");
      
      // Small delay to prevent race conditions between synthesis and recognition
      setTimeout(() => {
        if (isMountedRef.current) {
          startListening();
        }
      }, 100);
    };

    utterance.onerror = (event) => {
      if (!isMountedRef.current) return;
      
      console.error("Speech synthesis error", event);
      setSpeechStatus("idle");
    };

    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error speaking:", error);
      setSpeechStatus("idle");
    }
  }, [speakingVoice]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isMountedRef.current) return;
    
    try {
      setIsListening(true);
      recognitionRef.current.start();

      // Clear any existing timer first
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
      setSpeechStatus("idle");
      setIsListening(false);
    }
  }, [isListening]);

  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);

  const CONST = [
    "Please repeat the sentences that you hear",
    "Leave town on next Train",
    "Leave town on next Train",
  ];

  const rules = [
    "",
    "Part A..., Sentence Repitition",
    CONST[0],
    "for example, You will hear... 'Leave town on next Train'. and You should say... 'Leave town on next Train'.",
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
    if (speechSynthesis && speechSynthesis.speaking) {
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.error("Error canceling speech synthesis:", error);
      }
    }
  };

  useEffect(() => {
    speak();
    return () => {
      stop();
    };
  }, []);

  const startTest = () => {
    stop();
    setInTutorial(false);
    speakQuestion(questions[currentQuestionIndex].question);
  };
  
  return (
    <>
      <div className="part-body">
        <div className="part-header">
          <h2>
            <span className="circle">A</span>
            <p>Sentence Repetition</p>
          </h2>
          <div className="question-index">
            {!inTutorial ? (
              <>
                {" "}
                Attempting question no.{" "}
                <strong>
                  {currentQuestionIndex !== questions.length
                    ? currentQuestionIndex + 1
                    : currentQuestionIndex}
                </strong>{" "}
                out of {questions.length}
              </>
            ) : (
              "Instructions"
            )}
          </div>
        </div>
        <div className="part-box">
          {inTutorial ? (
            <Tutorial
              head={CONST[0]}
              see={CONST[1]}
              type={CONST[2]}
              click={startTest}
            />
          ) : currentQuestionIndex < questions.length ? (
            <>
              <div className="speech-qa-container">
                <>
                  {speechStatus === "idle" ? (
                    <div className="gray">
                      <i className="ri-loader-line"></i>Processing
                    </div>
                  ) : speechStatus === "listening" ? (
                    <div className="blue">
                      <i className="ri-mic-line"></i>Now Speak
                    </div>
                  ) : speechStatus === "speaking" ? (
                    <div className="gray">
                      <i className="ri-speak-line"></i>Listen
                    </div>
                  ) : (
                    ""
                  )}
                </>
              </div>
            </>
          ) : (
            <div className="part-box-complete">
              <p>Test completed!</p>
              <button onClick={onContinue} className="primary">
                Go to Next Part
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PartA;
