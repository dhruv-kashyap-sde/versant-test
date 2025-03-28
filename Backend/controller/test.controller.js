const Question = require("../models/question.model");
const Student = require("../models/student.model");
const TestAttempt = require("../models/testAttempt.model");
const checkPart = require("../utils/checkPart");

// Start a new test
exports.startTest = async (req, res) => {
  try {
    const { tin } = req.body;

    // Validate student
    const student = await Student.findOne({ tin });
    if (!student) {
      return res.status(404).json({ message: "Invalid TIN" });
    }

    // Check if student has an ongoing test
    // const ongoingTest = await TestAttempt.findOne({
    //   studentId: student._id,
    //   status: 'started'
    // });

    // if (ongoingTest) {
    //   return res.status(200).json({
    //     message: "Ongoing test found",
    //     testId: ongoingTest._id,
    //     questions: ongoingTest.questions
    //   });
    // }

    // Get random questions
    const allQuestions = await Question.findOne();
    if (!allQuestions) {
      return res.status(404).json({ message: "No questions available" });
    }

    // Function to get random elements
    const getRandomElements = (array, count) => {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, array.length));
    };

    // Get 2 questions from each part
    const testQuestions = {
      partA: getRandomElements(allQuestions.partA.questions, 2),
      partB: getRandomElements(allQuestions.partB.questions, 2),
      partC: getRandomElements(allQuestions.partC.questions, 2),
      partD: getRandomElements(allQuestions.partD.questions, 2),
      partE: getRandomElements(allQuestions.partE.questions, 2),
      partF: getRandomElements(allQuestions.partF.questions, 2)
    };

    // Create new test attempt
    const testAttempt = new TestAttempt({
      studentId: student._id,
      questions: testQuestions
    });

    await testAttempt.save();

    res.status(201).json({
      message: "Test started successfully",
      testId: testAttempt._id,
      questions: testQuestions
    });

  } catch (error) {
    res.status(500).json({ message: "Error starting test", error: error.message });
  }
};

// Submit test answers
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;

    const testAttempt = await TestAttempt.findById(testId);
    if (!testAttempt) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Update test answers and calculate scores
    testAttempt.answers = answers;
    testAttempt.endTime = new Date();
    testAttempt.status = 'completed';

    // Calculate scores for each part
    const scores = {
      partB: checkPart(testAttempt.questions.partB, answers.partB),
      partD: calculatePartDScore(testAttempt.questions.partD, answers.partD)
      // Other parts require manual evaluation
    };

    testAttempt.scores = {
      ...scores,
      total: (scores.partB + scores.partD) / 2 // Temporary calculation
    };

    await testAttempt.save();

    // Update student's test score
    await Student.findByIdAndUpdate(testAttempt.studentId, {
      testScore: testAttempt.scores.total
    });

    res.status(200).json({
      message: "Test submitted successfully",
      scores: testAttempt.scores
    });

  } catch (error) {
    res.status(500).json({ message: "Error submitting test", error: error.message });
  }
};

// Helper function for Part D scoring
function calculatePartDScore(questions, answers) {
  let correct = 0;
  questions.forEach((q, i) => {
    if (q.answer.toLowerCase() === answers[i]?.toLowerCase()) {
      correct++;
    }
  });
  return (correct / questions.length) * 100;
}

// Controller method to begin the student's test
exports.beginTest = async (req, res) => {
  const { tin } = req.body;

  if (!tin) {
    return res.status(400).json({ message: "TIN is required" });
  }

  try {
    const student = await Student.findOne({ tin });

    if (!student) {
      return res.status(404).json({ message: "Invalid TIN" });
    }

    // Logic to allow the student to continue the test
    // ...

    return res.status(200).json({ message: "TIN verified successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.checkSpeed = (req, res) => {
  res.status(200).json({success: true})
};

exports.checkResult = async (req, res) => {
  try {
    const studentAnswers = req.body;
    
    // Get questions from database
    const questions = await Question.findOne();
    if (!questions) {
      return res.status(404).json({ message: 'No questions found in database' });
    }

    // Initialize results object
    const results = {
      totalScore: 0,
      partA: 0,
      partB: 0,
      partC: 0,
      partD: 0,
      partE: 0,
      partF: 0,
    };

    // Process each part
    studentAnswers.forEach(part => {
      const partName = `part${part.part}`;
      const dbQuestions = questions[partName].questions;
      const studentPartAnswers = part.answers;

      results[partName].total = dbQuestions.length;

      // Special handling for Part B (rearranged sentences)
      if (partName === 'partB') {
        studentPartAnswers.forEach((answer, index) => {
          if (index < dbQuestions.length) {
            const isCorrect = answer.toLowerCase() === dbQuestions[index].rearranged.toLowerCase();
            results[partName].correct += isCorrect ? 1 : 0;
            results[partName].answers.push({
              studentAnswer: answer,
              correctAnswer: dbQuestions[index].rearranged,
              isCorrect
            });
          }
        });
      }
      // Special handling for Part D (with specific answers)
      else if (partName === 'partD') {
        studentPartAnswers.forEach((answer, index) => {
          if (index < dbQuestions.length) {
            const isCorrect = answer.toLowerCase() === dbQuestions[index].answer.toLowerCase();
            results[partName].correct += isCorrect ? 1 : 0;
            results[partName].answers.push({
              studentAnswer: answer,
              correctAnswer: dbQuestions[index].answer,
              isCorrect
            });
          }
        });
      }
      // Standard handling for other parts
      else {
        studentPartAnswers.forEach((answer, index) => {
          if (index < dbQuestions.length) {
            // For other parts, we might need manual evaluation
            // Here we're just recording the answers
            results[partName].answers.push({
              studentAnswer: answer,
              question: dbQuestions[index].question,
              requiresManualCheck: true
            });
          }
        });
      }
    });

    // Calculate total score
    const totalScore = {
      totalQuestions: Object.values(results).reduce((sum, part) => sum + part.total, 0),
      totalAnswered: studentAnswers.reduce((sum, part) => sum + part.answers.length, 0),
      totalCorrectAutoGraded: results.partB.correct + results.partD.correct,
      partsRequiringManualCheck: ['A', 'C', 'E', 'F']
    };

    return res.status(200).json({
      success: true,
      results,
      totalScore,
      message: 'Results processed successfully'
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing results', 
      error: error.message 
    });
  }
};
