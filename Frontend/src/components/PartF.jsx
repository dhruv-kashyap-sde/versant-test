// PassageReconstruction.jsx
import React, { useState, useEffect } from 'react';

function PassageReconstruction({ passage }) {
  const [showPassage, setShowPassage] = useState(true);
  const [timer, setTimer] = useState(30);
  const [responseTime, setResponseTime] = useState(90);
  const [reconstructedText, setReconstructedText] = useState('');

  useEffect(() => {
    let passageTimer;
    if (showPassage && timer > 0) {
      passageTimer = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setShowPassage(false);
    }
    return () => clearTimeout(passageTimer);
  }, [showPassage, timer]);

  useEffect(() => {
    let responseTimer;
    if (!showPassage && responseTime > 0) {
      responseTimer = setTimeout(() => setResponseTime(responseTime - 1), 1000);
    }
    return () => clearTimeout(responseTimer);
  }, [showPassage, responseTime]);

  const submitAnswer = async () => {
    const response = await fetch('/api/submit-passage-reconstruction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reconstructedText }),
    });
    const result = await response.json();
    // Handle result
  };

  return (
    <div>
      {showPassage ? (
        <div>
          <p>{passage}</p>
          <p>Time left: {timer} seconds</p>
        </div>
      ) : (
        <div>
          <p>Reconstruct the passage:</p>
          <p>Time left: {responseTime} seconds</p>
          <textarea
            value={reconstructedText}
            onChange={(e) => setReconstructedText(e.target.value)}
          />
          <button onClick={submitAnswer}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default PassageReconstruction;
