import React, { useEffect, useState, useRef, useContext } from 'react';
import Tutorial from '../utils/Tutorial';
import { AuthContext } from '../context/AuthContext';
import checkPartB from '../utils/test/checkpartB';

const PartB = ({ onContinue }) => {
  // const questions = [
  //   {
  //     question: "That building... internet access... has limited.",
  //     rearranged: "That building has limited internet access."
  //   },
  //   {
  //     question: "Left immediately... after the meeting ended... the sales man.",
  //     rearranged: "The salesman left immediately after the meeting ended."
  //   },
  //   {
  //     question: "What had occurred... in there absent... they discovered.",
  //     rearranged: "They discovered what had occurred in their absence."
  //   },
  //   {
  //     question: "Our recent report... in detail... describe the finding.",
  //     rearranged: "Our recent report describes the findings in detail."
  //   }
  // ];

  const { updatePartScore, totalScore, testQuestions } = useContext(AuthContext);
  
  const questions = testQuestions.partB;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('idle'); // 'idle', 'speaking', 'listening'

  const speechSynthesis = window.speechSynthesis;

  const voices = speechSynthesis.getVoices();
  let speakingVoice = voices[6];

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
        updatePartScore('B',transcript);
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
          // // console.log("All questions completed. Answers:", totalScore);
        }
      };

      recognitionRef.current.onerror = () => {
        updatePartScore('B',' '); // Store empty string for no answer
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

  // Start the process when component mounts or when currentQuestionIndex changes
  useEffect(() => {
    if (inTutorial) return;

    if (currentQuestionIndex < questions.length) {
      speakQuestion(questions[currentQuestionIndex].question);
    }

    if (currentQuestionIndex === questions.length) {
      // // console.log("All questions completed. Answers:", totalScore);
    }
  }, [currentQuestionIndex]);

  const speakQuestion = (text) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setSpeechStatus('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.7;
    utterance.voice = speakingVoice;
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

  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);

  const CONST = [
    "Please rearrange the word groups  that you hear into the correct sentence.",
    "was reading... my mother... her favourite magazine",
    "My mother was reading her favourite magazine."
  ]

  const rules = ["",
    "Part B..., Sentence Builds",
    CONST[0],
    "for example, You will hear... 'was reading... my mother... her favourite magazine'. and You should say... 'my mother was reading her favourite magazine.",
  ];

  const synth = speechSynthesis;
  let msgIndex = 0;
  let msg = new SpeechSynthesisUtterance();
  
  const speak = () => {
    if (msgIndex < rules.length) {
      msg.text = rules[msgIndex];
      // msg.voice = speakingVoice;
      // console.log(speakingVoice);
      
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

  const startTest = () => {
    stop();
    setInTutorial(false);
    speakQuestion(questions[currentQuestionIndex].question);
  }

  const checkanswers = () => {
    // console.log(checkPartB(questions, totalScore.partB.answers))
  }

  return (
    <>

      <div className="part-body">
        <div className="part-header">
          <h2>
            <span className="circle">B</span>
            <p>Sentence Builds</p>
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
            <Tutorial head={CONST[0]} see={CONST[1]} type={CONST[2]} click={startTest} />
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
              <button onClick={checkanswers} className="primary">Check answer</button>
            </div>
          )}
        </div>

      </div></>
  );
};

export default PartB;
