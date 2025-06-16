import React, { useState, useEffect, useContext } from "react";
import Tutorial from "../utils/Tutorial";
import { AuthContext } from "../context/AuthContext";

const PartE = ({ onContinue }) => {
  // const partEQuestions = [
  //   {question: "I have to agree with you."},
  //   {question: "The company first opened when I was much younger."},
  //   {question: "I don’t have any information."},
  //   {question: "It’s a good idea to create a different version of your resume."},
  //   {question: "You can use the computer in a minute."}
  // ];

  const { speakingVoice, updatePartScore, totalScore, testQuestions } =
    useContext(AuthContext);
  const partEQuestions = testQuestions.partE;
  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);

  const CONST = [
    "Please type each sentence exactly as you hear it. You will have 30 seconds for each sentence. Pay attention to spelling and punctuation. Click 'Next' when you are finished",
    "Can you work on Monday? Yes I can.",
    "Can you work on Monday? Yes I can.",
  ];

  const rules = ["", "Part E... Dictation", CONST[0]];

  const synth = speechSynthesis;
  let msgIndex = 0;
  let msg = new SpeechSynthesisUtterance();

  const speak = () => {
    if (msgIndex < rules.length) {
      msg.text = rules[msgIndex];
      msg.voice = speakingVoice;
      msg.rate = 1.1;
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
  const [speaking, setSpeaking] = useState(false);

  const startTest = () => {
    setInTutorial(false);
    stop();
    questionSpeaker(partEQuestions[currentQuestionIndex].question);
  };

  const questionSpeaker = (question) => {
    setSpeaking(true);
    msg.text = question;
    msg.voice = speakingVoice;
    synth.speak(msg);
    msg.onend = () => setSpeaking(false);
  };

  useEffect(() => {
    if (inTutorial) return;

    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      // console.log(timeLeft);
    }, 1000);

    if (currentQuestionIndex === partEQuestions.length) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft, inTutorial]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    totalScore.partE.answers.push(userAnswer);
    setUserAnswer("");
    setTimeLeft(30);
    // console.log(totalScore);
    if (currentQuestionIndex === partEQuestions.length - 1) {
      return;
    }
    questionSpeaker(partEQuestions[currentQuestionIndex + 1].question);
  };

  currentQuestionIndex > partEQuestions.length && onContinue();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNextQuestion();
  };

  return (
    <>
      <div className="part-body">
        <div className="part-header">
          <h2>
            <span className="circle">E</span>
            <p>Dictation</p>
          </h2>
          <div className="question-index">
            {!inTutorial ? (
              <>
                Attempting question no.{" "}
                <strong>
                  {currentQuestionIndex !== partEQuestions.length
                    ? currentQuestionIndex + 1
                    : currentQuestionIndex}
                </strong>{" "}
                out of {partEQuestions.length}
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
          ) : currentQuestionIndex < partEQuestions.length ? (
            <form onSubmit={handleSubmit} className="user-input-container">
              {speaking ? (
                <i
                  style={{ color: "var(--text-2)" }}
                  class="ri-customer-service-fill"
                ></i>
              ) : (
                <input
                  autoFocus
                  type="text"
                  className="user-input"
                  placeholder="Type what you heard..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
              )}
            </form>
          ) : (
            <div className="part-box-complete">
              <p>Test completed!</p>
              <button onClick={onContinue} className="primary">
                Go to Next Part
              </button>
            </div>
          )}
        </div>
        {currentQuestionIndex < partEQuestions.length && !inTutorial && (
          <>
            <span>Time left: {timeLeft} seconds</span>
            <button onClick={handleSubmit} className="secondary">
              {currentQuestionIndex < partEQuestions.length - 1
                ? "Skip to next Question"
                : "Submit"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PartE;
