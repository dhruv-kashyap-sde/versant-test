import React, { useState, useEffect } from "react";

const PartD = ({ onContinue }) => {
  const partDQuestions = [
    {
      question: "You’re driving too ___. you should slow down.",
      answer: "fast",
    },
    {
      question: "I haven’t eaten anything all day. I’m so ___.",
      answer: "hungry",
    },
    {
      question:
        "She was awarded a promotion based on her excellent ___ on the job.",
      answer: "performance",
    },
    {
      question:
        "It was so ___ outside that no one wanted to leave the air-conditioned house.",
      answer: "hot",
    },
  ];

  // tutorial logic
  const [inTutorial, setInTutorial] = useState(true);
  const rules = ["",
    "Part D",
    "Sentence completion ",
    "Please type one word that best fits the meaning of the sentence. Type only one word. You will have 20 seconds for each sentence. Click 'Next' when you are finished.",
  ];

  const synth = speechSynthesis;
  let msgIndex = 0;
  let msg = new SpeechSynthesisUtterance();

  const speak = () => {
    if (msgIndex < rules.length) {
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
  const [allAnswers, setAllAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const startTest = () => {
    setInTutorial(false);
    stop();
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      console.log(timeLeft);
    }, 1000);

    if (currentQuestionIndex === partDQuestions.length) {
      clearInterval(timer);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setUserAnswer("");
    setTimeLeft(20);
    setAllAnswers([...allAnswers, userAnswer]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log([...allAnswers, userAnswer]);

    handleNextQuestion();
    onContinue();
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
                <strong>
                  {currentQuestionIndex !== partDQuestions.length
                    ? currentQuestionIndex + 1
                    : currentQuestionIndex}
                </strong>
                /{partDQuestions.length}
              </>
            ) : (
              "Instructions"
            )}
          </div>
        </div>
        <div className="part-box">
          {inTutorial ? (
            <div className="tutorial">
              <p>Please type one word that best fits the meaning of the sentence. Type only one word. You will have 25 seconds for each sentence. Click "Next" when you are finished.</p>
              <div className="tut-box">
                <div className="box">
                  <h3>You see:</h3>
                  <div style={{background:"var(--text-2)"}} className="color">
                    It's ___ tonight. Bring your sweater.
                  </div>
                </div>
                <div className="box">
                  <h3>You type:</h3>
                  <div style={{background:"var(--theme)"}} className="color">cold</div>
                </div>
              </div>
              <button onClick={startTest} className="primary">Start</button>
            </div>
          ) : currentQuestionIndex < partDQuestions.length ? (
            <div>
              <p>{partDQuestions[currentQuestionIndex].question}</p>
              <input
                type="text"
                placeholder="Enter your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </div>
          ) : (
            <p>Test completed!</p>
          )}
        </div>
        {currentQuestionIndex < partDQuestions.length && !inTutorial && (
          <>
            <span>Time left: {timeLeft} seconds</span>
            <button onClick={handleSubmit} className="primary">
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
