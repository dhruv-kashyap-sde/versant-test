import React, { useState, useEffect } from "react";

const PartD = () => {
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      console.log(timeLeft);
      
    }, 1000);
    
  if (currentQuestionIndex === partDQuestions.length) {
    clearInterval(timer)
  }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setUserAnswer("");
    setTimeLeft(20);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(currentQuestionIndex);
    setAllAnswers([...allAnswers, userAnswer]);
    console.log([...allAnswers, userAnswer]);
    
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
            <strong>{currentQuestionIndex !== partDQuestions.length? currentQuestionIndex + 1 : currentQuestionIndex}</strong>/{partDQuestions.length }
          </div>
        </div>
        <div className="part-box">
          {currentQuestionIndex < partDQuestions.length ? (
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
        {currentQuestionIndex < partDQuestions.length && (
          <>
            <span>TIme left: {timeLeft} seconds</span>
            <button onClick={handleSubmit} className="primary">
              Next Question
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PartD;
