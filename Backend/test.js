const Levenshtein = require("fast-levenshtein");
const test = require('./constants/questions.json');

const expectedSentence = "  With all the good programs available it’s difficult to make a quick decision.";
const transcribedSentence = " With all good program available it is difficult to make quick decision.";

// Calculate Levenshtein distance
const distance = Levenshtein.get(
  expectedSentence.toLowerCase(),
  transcribedSentence.toLowerCase()
);

const maxLen = Math.max(expectedSentence.length, transcribedSentence.length);

const similarityScore = ((maxLen - distance) / maxLen) * 100;

// Normalize if necessary
const normalizedScore = Math.min(Math.max(similarityScore, 0), 100);

console.log(normalizedScore);
