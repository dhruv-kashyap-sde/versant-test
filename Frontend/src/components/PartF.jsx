import React, { useState, useEffect, useContext } from "react";
import Tutorial from "../utils/Tutorial";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const PartF = ({ onContinue }) => {

  const { speakingVoice, totalScore, testQuestions, testId, testReport, setTestReport } =
    useContext(AuthContext);
  const partFQuestions = testQuestions.partF;

  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);

  const CONST = [
    "You will have 30 seconds to read a paragraph. After 30 seconds, the paragraph will disappear from the screen. Then, you will have 90 seconds to reconstruct the paragraph. Show that you understood the passage by rewriting it in your own words. Your answer will be scored for clear and accurate content, not word-for-word memorization.",
    "Mic went to 10 job interviews. At the last interview, he finally received a job offer.",
    "Mic had 10 job interviews. He got an offer after the final interview.",
  ];

  const rules = ["", "Part F..., Passage Reconstruction.", CONST[0]];

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

  // handling question logic
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [showInput, setShowInput] = useState(false);

  const startTest = () => {
    stop();
    setInTutorial(false);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (inTutorial) return;

    if (timeLeft === 0) {
      if (showInput) {
        handleNextQuestion();
      } else {
        setShowInput(true);
        setTimeLeft(90);
      }
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (currentQuestionIndex === partFQuestions.length) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft, inTutorial, showInput]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    totalScore.partF.answers.push(userAnswer);
    setUserAnswer("");
    setShowInput(false);
    setTimeLeft(30);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNextQuestion();
    // console.log(totalScore);
  };

  const [loading, setLoading] = useState(false);

    const updateTestReport = () => {
    setTestReport(prev => ({
      ...prev,
      testEndTime: new Date().toISOString(),
    }));
  }
  
  const handleAnswerSubmission = async () => {
  updateTestReport();
    try {
      setLoading(true);
      let response = await axios.post(`${import.meta.env.VITE_API}/submit`, {
        answers: totalScore,
        testId,
        testReport,
      });
      // console.log(response.data);
      if (response.status === 200) {
        onContinue();
      }
      console.log("from part f", totalScore,
        testId,
        testReport);
      
      toast.success("Test completed successfully");
    } catch (error) {
      console.error("Error submitting test", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="part-body">
        <div className="part-header">
          <h2>
            <span className="circle">F</span>
            <p>Passage Reconstruction</p>
          </h2>
          <div className="question-index">
            {!inTutorial ? (
              <>
                Attempting question no.{" "}
                <strong>
                  {currentQuestionIndex !== partFQuestions.length
                    ? currentQuestionIndex + 1
                    : currentQuestionIndex}
                </strong>{" "}
                out of {partFQuestions.length}
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
          ) : currentQuestionIndex < partFQuestions.length ? (
            <>
              {!showInput ? (
                <p 
                  style={{ 
                    width: "90%", 
                    userSelect: "none", 
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none"
                  }} 
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {partFQuestions[currentQuestionIndex].question}
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="user-input-container textarea"
                >
                  <textarea
                    rows={10}
                    autoFocus
                    type="text"
                    className="user-input"
                    placeholder="Type your answer..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                  />
                  <button className="secondary">Submit </button>
                </form>
              )}
            </>
          ) : (
            <div className="part-box-complete">
              <p>Test completed!</p>
              <button onClick={handleAnswerSubmission} className="primary">
                {loading ? "Loading" : "Finish Test"}
              </button>
            </div>
          )}
        </div>
        {currentQuestionIndex < partFQuestions.length && !inTutorial && (
          <>
            <span>Time left: {timeLeft} seconds</span>
            {!showInput ? (
              <button onClick={() => {
                setShowInput(true);
                setTimeLeft(90);
                }} className="secondary">
                Skip and Write
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="secondary">
                Skip to Next Question
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PartF;
