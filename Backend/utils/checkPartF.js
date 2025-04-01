/**
 * Checks the accuracy of rewritten passages compared to original passages
 * 
 * @param {Array} questions - Array of question objects containing the original passages
 * @param {Array} answers - Array of user rewritten passages
 * @returns {Array} Array of evaluation objects containing scores
 */
const checkPartFScore = (questions, answers) => {
  if (!Array.isArray(questions) || !Array.isArray(answers)) {
    return [{
      score: 0,
      pass: false,
      message: "Invalid input format. Expected arrays for questions and answers."
    }];
  }

  // Process each question-answer pair
  return questions.map((questionObj, index) => {
    const originalPassage = questionObj.question;
    const userRewrite = answers[index] || "";
    
    return evaluatePassage(originalPassage, userRewrite);
  });
};

/**
 * Helper function to evaluate a single passage
 */
const evaluatePassage = (originalPassage, userRewrite) => {
  // If either input is missing, return error
  if (!originalPassage || !userRewrite) {
    return {
      score: 0,
      pass: false
    };
  }

  // Convert to lowercase and remove punctuation for better comparison
  const cleanOriginal = originalPassage.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  const cleanRewrite = userRewrite.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // Split passages into words
  const originalWords = cleanOriginal.split(/\s+/).filter(word => word.length > 3);
  const rewriteWords = cleanRewrite.split(/\s+/).filter(word => word.length > 3);

  // Check word count - should be somewhat similar to original (not too short)
  const wordCountRatio = rewriteWords.length / originalWords.length;
  if (wordCountRatio < 0.5) {
    return {
      score: Math.floor(40 * wordCountRatio),
      pass: false
    };
  }

  // Count significant words from original that appear in the rewrite
  let keyWordsFound = 0;
  const uniqueOriginalWords = [...new Set(originalWords)];
  
  for (const word of uniqueOriginalWords) {
    if (rewriteWords.includes(word)) {
      keyWordsFound++;
    }
  }

  const keyWordRatio = keyWordsFound / uniqueOriginalWords.length;

  // Calculate overall score
  let score = 0;
  let pass = false;

  if (keyWordRatio < 0.1) {
    score = 40;
  } else if (keyWordRatio > 0.7) {
    // Modified scoring for high keyword matches
    // For factual passages, high keyword matches can still be valid paraphrases
    // Check if sentence structure is different despite shared keywords
    const originalSentences = originalPassage.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const rewriteSentences = userRewrite.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // If sentence count is different, it's likely a good paraphrase
    if (originalSentences.length !== rewriteSentences.length) {
      score = 80;
      pass = true;
    } 
    // If word order differs significantly, it's still a good paraphrase
    else if (wordOrderDifference(cleanOriginal, cleanRewrite) > 0.5) {
      score = 75;
      pass = true;
    } 
    // Otherwise, use original scoring
    else {
      score = 60;
    }
  } else {
    // Ideal range - using own words while capturing key concepts
    score = Math.floor(70 + (30 * (keyWordRatio / 0.5)));
    pass = score > 70;
  }

  return {
    score: Math.min(score, 100),
    pass,
    metrics: {
      wordCountRatio,
      keyWordRatio
    }
  };
};

/**
 * Helper function to evaluate word order differences
 * Returns a value between 0 (identical order) and 1 (completely different order)
 */
const wordOrderDifference = (text1, text2) => {
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  
  // Get common words
  const commonWords = words1.filter(word => words2.includes(word));
  
  if (commonWords.length < 5) return 1; // Too few common words to compare
  
  // Check positions of common words in both texts
  let positionDifference = 0;
  
  for (const word of commonWords) {
    const pos1 = words1.indexOf(word) / words1.length;
    const pos2 = words2.indexOf(word) / words2.length;
    positionDifference += Math.abs(pos1 - pos2);
  }
  
  return Math.min(1, positionDifference / commonWords.length);
};

const checkPartF = (questions, answers) => {
    const results = checkPartFScore(questions, answers);
    let totalScore = 0;
    results.forEach(result => {
        totalScore += result.score;
    });
    return totalScore / results.length;   
}

module.exports = checkPartF;
