// Helper function for Part D scoring
import stringSimilarity from "string-similarity";

export function checkPartD(questions, answers) {
  let correct = 0;
  const SIMILARITY_THRESHOLD = 0.8; // 80% similarity threshold - adjust as needed

  questions.forEach((q, i) => {
    const correctAnswer = q.answer.toLowerCase().trim();
    const userAnswer = answers[i]?.toLowerCase().trim() || "";

    // Check for exact match first
    if (correctAnswer === userAnswer) {
      correct++;
    }
    // If not exact match, check similarity
    else {
      const similarity = stringSimilarity.compareTwoStrings(
        correctAnswer,
        userAnswer
      );
      correct = correct + similarity;
    }
  });

  return (correct / questions.length) * 100;
}
