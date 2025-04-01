/**
 * Evaluates Part C answers with binary scoring:
 * - If at least one keyword matches: score = 100
 * - If no keywords match: score = 0
 * 
 * @param {Array} questions - Array of question objects containing keywords
 * @param {Array} answers - Array of user answer strings
 * @returns {Number} Score between 0-100 reflecting answer quality
 */
const evaluatePartCAnswers = (questions, answers) => {
  // Validate inputs
  if (!Array.isArray(questions) || !Array.isArray(answers)) {
    return 0;
  }
  
  let totalScore = 0;
  let questionCount = 0;
  
  // Process each question-answer pair
  for (let i = 0; i < questions.length; i++) {
    // Skip if answer is missing
    if (!answers[i]) continue;
    
    const question = questions[i];
    const answer = answers[i].toLowerCase().trim();
    
    // Skip if question doesn't have keywords
    if (!question.keywords || !Array.isArray(question.keywords) || question.keywords.length === 0) {
      continue;
    }
    
    // Track if any keyword matches
    let hasMatch = false;
    
    // Check for any keyword in the answer
    for (const keyword of question.keywords) {
      if (answer.includes(keyword.toLowerCase())) {
        hasMatch = true;
        break; // One match is enough
      }
    }
    
    // Binary scoring: 100 if matched, 0 if not
    totalScore += hasMatch ? 100 : 0;
    questionCount++;
  }
  
  // Calculate average score across all questions
  if (questionCount === 0) return 0;
  
  const finalScore = Math.round(totalScore / questionCount);
  return finalScore;
};

/**
 * Calculate a normalized score for Part C
 * @param {Array} questions - Array of question objects
 * @param {Array} answers - Array of user answers
 * @returns {Number} Normalized score from 0-100
 */
const checkPartC = (questions, answers) => {
  return evaluatePartCAnswers(questions, answers);
};

module.exports = {
  evaluatePartCAnswers,
  checkPartC
};
