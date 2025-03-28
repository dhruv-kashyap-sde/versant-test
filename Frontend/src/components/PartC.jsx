import React, { useState, useEffect, useRef, useContext } from 'react';
import Tutorial from '../utils/Tutorial';
import { AuthContext } from '../context/AuthContext';

const PartC = ({ onContinue }) => {
  // Sample conversation data
  // const questions = [
  //   {
  //     dialog: [
  //       { speaker: "Speaker 1", text: "Lucy, can you come to the office early tomorrow?" },
  //       { speaker: "Speaker 2", text: "Sure, what time?" },
  //       { speaker: "Speaker 1", text: "7:30 would be great." },
  //     ],
  //     question: "What will Lucy have to do tomorrow morning?",
  //     keywords: ["go to the office", "early", "7:30", "come to the office", "be at the office"],
  //   },
  //   {
  //     dialog: [
  //       { speaker: "Speaker 1", text: "did you got the book?" },
  //       { speaker: "Speaker 2", text: "Yes, it was interesting." },
  //       { speaker: "Speaker 1", text: "Glad to hear that." },
  //     ],
  //     question: "how was the book?",
  //     keywords: ["interesting", "good", "nice", "enjoyed", "liked"],
  //   },
  //   {
  //     dialog: [
  //       { speaker: "Speaker 1", text: "Did you hire any of the employee?" },
  //       { speaker: "Speaker 2", text: "No i did not." },
  //       { speaker: "Speaker 1", text: "I guess no one had enough experience, right?" },
  //     ],
  //     question: "Why employees were not hired?",
  //     keywords: ["experience", "no one had enough experience", "no experience", "not enough experience"],
  //   },
  //   // Add more questions here
  // ];
  const { speakingVoice, updatePartScore, totalScore, testQuestions } = useContext(AuthContext);

  const questions = testQuestions.partC;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const synth = useRef(window.speechSynthesis);
  const voicesLoaded = useRef(false);  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);  
  const timerRef = useRef(null);

  // Get available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.current.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        voicesLoaded.current = true;
      }
    };

    loadVoices();

    // Some browsers need this event to load voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.current.cancel();
    };
  }, []);

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
        updatePartScore('C', transcript);
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
          console.log("All questions completed. Answers:", totalScore);
        }
      };

      recognitionRef.current.onerror = () => {
        updatePartScore('C',' '); // Store empty string for no answer
        setIsListening(false);
        setSpeechStatus('idle');
        // Remove the index increment from here since onend will handle it
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

  const playConversation = () => {
    if (availableVoices.length < 2) {
      alert("Not enough voices available for different speakers");
      return;
    }

    setSpeechStatus('speaking');
    synth.current.cancel(); // Cancel any ongoing speech

    const currentConversation = questions[currentQuestionIndex];

    // Choose two different voices
    const voice1 = availableVoices.find(voice => voice.name.includes('Male')) || availableVoices[0];
    const voice2 = availableVoices.find(voice => voice.name.includes('Female')) || availableVoices[1];

    // Queue all dialogue parts
    currentConversation.dialog.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.voice = line.speaker === "Speaker 1" ? voice1 : voice2;
      
      // No end callback here since we'll add the question afterward
      
      // Add a small delay between speakers
      setTimeout(() => {
        synth.current.speak(utterance);
      }, index * 300);
    });
    
    // Add the question after a short pause
    setTimeout(() => {
      const questionUtterance = new SpeechSynthesisUtterance("Question: " + currentConversation.question);
      // Use a neutral voice for the question (can use voice1 or any preferred voice)
      questionUtterance.voice = availableVoices[4];
      
      // Set the end callback on the question utterance
      questionUtterance.onend = () => {
        setSpeechStatus('listening');
        startListening();
      };
      
      synth.current.speak(questionUtterance);
    }, currentConversation.dialog.length * 300 + 1000); // Add extra pause before question
  };

  // Start the process when component mounts or when currentQuestionIndex changes
  useEffect(() => {
    if (inTutorial) return;

    if (currentQuestionIndex < questions.length) {
      playConversation();
    }

    if (currentQuestionIndex === questions.length) {
      console.log("All questions completed. Answers:", totalScore);
    }
  }, [currentQuestionIndex]);

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

  const checkAnswer = () => {
    const currentConversation = questions[currentQuestionIndex];
    console.log(currentConversation);
    

    // Convert to lowercase for case-insensitive matching
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();

    // Check if any keyword is present in the answer
    const isCorrect = currentConversation.keywords.some(keyword =>
      normalizedUserAnswer.includes(keyword.toLowerCase())
    );

    setFeedback(isCorrect ? "Correct! Well done." : "Try again. Think about what Lucy needs to do.");
  };

  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);
  const [speechStatus, setSpeechStatus] = useState('idle'); // 'idle', 'speaking', 'listening'

  const CONST = [
    "You will here conversation between 2 people, followed by question. Give a simple, short answer to the question.",
    "Speaker 1: Lucy, can you come to the office early tomorrow?",
    "Speaker 2: Sure, what time?",
    "Speaker 1: 7:30 would be great.",
    "Question: What will Lucy have to do tomorrow morning?",
    '"Go to the office early." or "She will go to the office at 7:30"'
  ]

  const rules = ["",
    "Part C..., Conversation",
    CONST[0],
  ];

  const speechSynth = speechSynthesis;
  let msgIndex = 0;
  let msg = new SpeechSynthesisUtterance();

  const speak = () => {
    if (msgIndex < rules.length) {
      msg.text = rules[msgIndex];
      msg.voice = speakingVoice;
      speechSynth.speak(msg);
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


  const startTest = () => {
    stop();
    setInTutorial(false);
    playConversation();
  }

  return (
    <div className="part-body">
      <div className="part-header">
        <h2>
          <span className="circle">C</span>
          <p>Conversation</p>
        </h2>
        <div className="question-index">
          {!inTutorial ? (
            <>
              <strong>
                {currentQuestionIndex !== questions.length
                  ? currentQuestionIndex + 1
                  : currentQuestionIndex}
              </strong>
              /{questions.length}
            </>
          ) : (
            "Instructions"
          )}
        </div>
      </div>
      <div className="part-box">
        {inTutorial ? (
          <>
            <div className="tutorial">
              <p>{CONST[0]}</p>
              <div className="tut-box">
                <div className="box">
                  <h3>Your question will be :</h3>
                  <div style={{ background: "var(--text-2)", textAlign: "start" }} className="color">
                    {CONST[1]}<br />
                    {CONST[2]}<br />
                    {CONST[3]}<br />
                    {" "}<br />
                    {CONST[4]}
                  </div>
                </div>
                <div className="box">
                  <h3>Your answer will be :</h3>
                  <div style={{ background: "var(--theme)" }} className="color">
                    {CONST[5]}
                  </div>
                </div>
              </div>
              <button onClick={startTest} className="primary">
                Start
              </button>
            </div>
          </>
        ) : currentQuestionIndex < questions.length ? (
          <>
            <div className="speech-qa-container">
              <>{speechStatus === 'idle'
                ? <div className="gray"><i class="ri-loader-line"></i>Processing</div>
                : speechStatus === "listening"
                  ? <div className="blue"><i class="ri-mic-line"></i>Now Speak</div>
                  : speechStatus === 'speaking'
                    ? <div className="gray"><i class="ri-speak-line"></i>Listen</div>
                    : ""}</>
            </div>
          </>
        ) : (
          <div className="part-box-complete">
            <p>Test completed!</p>
            <button onClick={onContinue} className="primary">Go to Next Part</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default PartC;