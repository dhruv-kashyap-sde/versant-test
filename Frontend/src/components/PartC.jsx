// ConversationAudio.jsx
import React, { useState, useRef } from 'react';

function ConversationAudio({ audioSrc, question }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      // Send audioBlob to the server
      uploadAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'conversation_answer.wav');

    await fetch('/api/submit-conversation', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div>
      {/* Conversation Audio */}
      <audio controls src={audioSrc}></audio>

      {/* Display Question */}
      <p>{question}</p>

      {/* Recording Controls */}
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
    </div>
  );
}

export default ConversationAudio;
