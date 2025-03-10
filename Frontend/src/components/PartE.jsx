// DictationTask.jsx
import React, { useState } from 'react';

function DictationTask({ audioSrc }) {
  const [typedSentence, setTypedSentence] = useState('');

  const submitAnswer = async () => {
    const response = await fetch('/api/submit-dictation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ typedSentence }),
    });
    const result = await response.json();
    // Handle result
  };

  return (
    <div>
      {/* Audio Player */}
      <audio controls src={audioSrc}></audio>

      {/* Typing Area */}
      <textarea
        value={typedSentence}
        onChange={(e) => setTypedSentence(e.target.value)}
      />

      {/* Submit Button */}
      <button onClick={submitAnswer}>Submit</button>
    </div>
  );
}

export default DictationTask;
