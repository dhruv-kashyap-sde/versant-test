// SentenceCompletion.jsx
import React, { useState } from 'react';

function SentenceCompletion({ sentence }) {
  const [word, setWord] = useState('');

  const submitAnswer = async () => {
    const response = await fetch('/api/submit-sentence-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    const result = await response.json();
    // Handle result
  };

  return (
    <div>
      {/* Display Sentence */}
      <p>{sentence.replace('___', '_____')}</p>

      {/* Input for Missing Word */}
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      {/* Submit Button */}
      <button onClick={submitAnswer}>Submit</button>
    </div>
  );
}

export default SentenceCompletion;
