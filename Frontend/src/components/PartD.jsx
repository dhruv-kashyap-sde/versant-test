import React, { useState, useEffect, useContext } from "react";
import Tutorial from "../utils/Tutorial";
import { AuthContext } from "../context/AuthContext";

const PartD = ({ onContinue }) => {
  // const partDQuestions = [
  //   {
  //     question: "You’re driving too ___. you should slow down.",
  //     answer: "fast",
  //   },
  //   {
  //     question: "I haven’t eaten anything all day. I’m so ___.",
  //     answer: "hungry",
  //   },
  //   {
  //     question:
  //       "She was awarded a promotion based on her excellent ___ on the job.",
  //     answer: "performance",
  //   },
  //   {
  //     question:
  //       "It was so ___ outside that no one wanted to leave the air-conditioned house.",
  //     answer: "hot",
  //   },
  // ];

  const { speakingVoice, updatePartScore, totalScore, testQuestions } =
    useContext(AuthContext);

  const partDQuestions = testQuestions.partD;
  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);

  const CONST = [
    "Please type one word that best fits the meaning of the sentence. Type only one word. You will have 20 seconds for each sentence. Click 'Next' when you are finished.",
    "It's ___ tonight. Bring your sweater.",
    "cold",
  ];

  const rules = ["", "Part D... Sentence completion", CONST[0]];

  const synth = speechSynthesis;
  let msgIndex = 0;
  let msg = new SpeechSynthesisUtterance();

  const speak = () => {
    if (msgIndex < rules.length) {
      msg.voice = speakingVoice;
      msg.text = rules[msgIndex];
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
  const [timeLeft, setTimeLeft] = useState(20);

  const startTest = () => {
    setInTutorial(false);
    stop();
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

    if (currentQuestionIndex === partDQuestions.length) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft, inTutorial]);

  const handleNextQuestion = () => {
    totalScore.partD.answers.push(userAnswer);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setUserAnswer("");
    setTimeLeft(20);
    // console.log(totalScore);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNextQuestion();
  };

  return (
    <>
      <div className="part-body">
        <div className="part-header">
          <h2>
            <span className="circle">D</span>
            <p>Sentence Completion</p>
          </h2>
          <div className="question-index">
            {!inTutorial ? (
              <>
                Attempting question no.{" "}
                <strong>
                  {currentQuestionIndex !== partDQuestions.length
                    ? currentQuestionIndex + 1
                    : currentQuestionIndex}
                </strong>{" "}
                out of {partDQuestions.length}
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
          ) : currentQuestionIndex < partDQuestions.length ? (
            <form onSubmit={handleSubmit}>
              <p>{partDQuestions[currentQuestionIndex].question}</p>
              <input
                autoFocus
                type="text"
                placeholder="Enter your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
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
        {currentQuestionIndex < partDQuestions.length && !inTutorial && (
          <>
            <span>Time left: {timeLeft} seconds</span>
            <button
              onClick={
                currentQuestionIndex < partDQuestions.length - 1
                  ? handleSubmit
                  : onContinue
              }
              className="secondary"
            >
              {currentQuestionIndex < partDQuestions.length - 1
                ? "Next Question"
                : "Submit"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PartD;
