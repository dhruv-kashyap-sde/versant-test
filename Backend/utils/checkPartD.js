// Helper function for Part D scoring
export function checkPartD(questions, answers) {
    let correct = 0;
    questions.forEach((q, i) => {
      if (q.answer.toLowerCase().trim() === answers[i].toLowerCase().trim()) {
        correct++;
      }
    });
    
    return (correct / questions.length) * 100;
}