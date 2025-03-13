import React, { useEffect, useState } from 'react';

const PartA = () => {
  const sentences = [
    "Please repeat this sentence.",
    "This is the second sentence.",
    "Here comes the third sentence.",
    "Now repeat the fourth sentence.",
    "Finally, this is the fifth sentence."
  ];

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [studentResponses, setStudentResponses] = useState([]);

  const speakSentence = (index) => {
    const synth = speechSynthesis;
    const msg = new SpeechSynthesisUtterance(sentences[index]);
    msg.onend = () => {
      // Start listening to the student's response after the sentence is spoken
      startListening();
    };
    synth.speak(msg);
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleStudentResponse(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition service disconnected');
    };

    recognition.start();
  };

  const handleStudentResponse = (response) => {
    setStudentResponses([...studentResponses, response]);
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    } else {
      console.log("All sentences have been repeated.");
      // Handle the end of the repetition part
    }
  };

  useEffect(() => {
    speakSentence(currentSentenceIndex);
  }, [currentSentenceIndex]);

  return (
    <div>
      <h2>Repetition Part</h2>
      <p>Please repeat the sentence you hear.</p>
      {/* The sentences are not displayed, only spoken */}
    </div>
  )
}

export default PartA;