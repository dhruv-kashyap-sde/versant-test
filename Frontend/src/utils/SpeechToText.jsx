import React, { useState, useEffect } from 'react';

const TestContainer = ({ tin, onTestComplete }) => {
  // State to hold entire test data (sections, questions)
  const [testData, setTestData] = useState(null);
  // Maintain which section (part) the student is on (0 to 5)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  // Store student answers, keyed by section name and then question ID
  const [answers, setAnswers] = useState({});
  // Flag during submission to provide feedback to user
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Store final score returned from backend
  const [finalScore, setFinalScore] = useState(null);

  // Fetch test questions based on the TIN
  useEffect(() => {
    async function fetchTest() {
      try {
        // Example endpoint: /api/test/questions?tin=1234567890
        const response = await fetch(`/api/test/questions?tin=${tin}`);
        if (!response.ok) throw new Error('Failed to load test');
        const data = await response.json();
        // Assume data contains { title: 'English Proficiency Test', sections: [ ... ] }
        setTestData(data);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    }

    fetchTest();
  }, [tin]);

  // Function to handle answer updates
  const handleAnswerChange = (sectionName, questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [sectionName]: {
        ...prevAnswers[sectionName],
        [questionId]: answer,
      },
    }));
  };

  // Navigate to next section if available
  const handleNextSection = () => {
    if (currentSectionIndex < testData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  // Navigate to previous section if available
  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Handle final test submission
  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    try {
      // Compose the payload with TIN and all answers
      const payload = { tin, answers };
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();
      // The backend returns a payload that includes a 'score' field and any feedback
      setFinalScore(result.score);
      onTestComplete && onTestComplete(result);
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // While waiting for test data to load...
  if (!testData) {
    return <div>Loading test questions...</div>;
  }

  const currentSection = testData.sections[currentSectionIndex];

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>{testData.title}</h2>
      <h3>
        Section {currentSectionIndex + 1}: {currentSection.name}
      </h3>

      <div>
        {currentSection.questions.map((question) => (
          <div key={question.id} style={{ marginBottom: '1rem' }}>
            <p>{question.prompt}</p>
            {/* For simplicity, using an input field; this could vary by question type */}
            <input
              type="text"
              value={
                (answers[currentSection.name] &&
                  answers[currentSection.name][question.id]) ||
                ''
              }
              onChange={(e) =>
                handleAnswerChange(
                  currentSection.name,
                  question.id,
                  e.target.value
                )
              }
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        {currentSectionIndex > 0 && (
          <button onClick={handlePrevSection}>Previous</button>
        )}
        {currentSectionIndex < testData.sections.length - 1 ? (
          <button onClick={handleNextSection}>Next</button>
        ) : (
          <button onClick={handleSubmitTest} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>

      {finalScore !== null && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Your Final Score: {finalScore}</h3>
        </div>
      )}
    </div>
  );
};

export default TestContainer;
