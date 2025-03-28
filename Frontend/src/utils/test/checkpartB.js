import Levenshtein from "fast-levenshtein";
const checkPartB = (questions, answers) => {
    let totalScore = 0;
    
    questions.forEach((question, index) => {
        const expectedSentence = question.rearranged.toLowerCase().trim();
        const transcribedSentence = answers[index] ? answers[index].toLowerCase().trim() : '';
        
        // Exact match check
        if (expectedSentence === transcribedSentence) {
            totalScore += 100;
            return;
        }

        // Word order check
        const expectedWords = expectedSentence.split(/\s+/);
        const transcribedWords = transcribedSentence.split(/\s+/);
        
        // Check if all words are present (regardless of order)
        const wordMatchCount = expectedWords.filter(word => 
            transcribedWords.includes(word)
        ).length;
        
        // Calculate word match percentage
        const wordMatchScore = (wordMatchCount / expectedWords.length) * 50;

        // Calculate Levenshtein similarity only if there's some word match
        let levenshteinScore = 0;
        if (wordMatchScore > 0) {
            const distance = Levenshtein.get(expectedSentence, transcribedSentence);
            const maxLen = Math.max(expectedSentence.length, transcribedSentence.length);
            levenshteinScore = ((maxLen - distance) / maxLen) * 50;
        }

        // Combine both scores with more weight on exact word matches
        const combinedScore = wordMatchScore + levenshteinScore;
        totalScore += combinedScore;
    });
    
    const avg = questions.length > 0 ? totalScore / questions.length : 0;
    return Math.round(avg);
};

const answers = [
    "u staying here?",
    "do pictures of family?",
    "he ",
    "door is sale."
]

const questions = [
    {
      question: "Staying here... how long... are you?",
      rearranged: "How long are you staying here?"
    },
    {
      question: "Of your family... any pictures... do you have?",
      rearranged: "Do you have any pictures of your family?"
    },
    {
      question: "Of mine... he is...  a friend.",
      rearranged: "He is a friend of mine."
    },
    {
      question: "Next door... is for sale... the house.",
      rearranged: "The house next door is for sale."
    }
]

export default checkPartB;