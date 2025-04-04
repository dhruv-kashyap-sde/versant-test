const Question = require("../models/question.model");
const Student = require("../models/student.model");
const TestAttempt = require("../models/testAttempt.model");
const { calculatePartDScore, checkPartD } = require("../utils/checkPartD");
const checkPart = require("../utils/checkPart");
const { calculatePartCScore, getPartCScore, checkPartC } = require("../utils/checkPartC");
const checkPartF = require("../utils/checkPartF");

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
    const ongoingTest = await Student.findOne({
      _id: student._id,
      status: 'started'
    });

    if (ongoingTest) {
      return res.status(200).json({
        message: "Ongoing test found",
        testId: ongoingTest._id,
        status: ongoingTest.status,
      });
    }

    // Check if student has already completed a test
    const completedTest = await Student.findOne({
      _id: student._id,
      status: 'completed'
    });

    if (completedTest) {
      return res.status(200).json({
        message: "You have already completed this test",
        testId: completedTest._id,
        status: completedTest.status,
      });
    }

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
      partA: getRandomElements(allQuestions.partA.questions, 8),
      partB: getRandomElements(allQuestions.partB.questions, 8),
      partC: getRandomElements(allQuestions.partC.questions, 2),
      partD: getRandomElements(allQuestions.partD.questions, 8),
      partE: getRandomElements(allQuestions.partE.questions, 8),
      partF: getRandomElements(allQuestions.partF.questions, 2)
    };

    // Create new test attempt
    const testAttempt = new TestAttempt({
      studentId: student._id,
      questions: testQuestions,
    });

    await testAttempt.save();

    // Update student's test score
    await Student.findByIdAndUpdate(student._id, {
      testStatus: 'started'
    });

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

    let testAttempt = await TestAttempt.findById(testId);

    if (!testAttempt) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Update test answers and calculate scores
    testAttempt.answers = answers;

    testAttempt.endTime = new Date();

    // Calculate scores for each part
    const scores = {
      partA: checkPart(testAttempt.questions.partA, answers.partA.answers),
      partB: checkPart(testAttempt.questions.partB, answers.partB.answers),
      partC: checkPartC(testAttempt.questions.partC, answers.partC.answers),
      partD: checkPartD(testAttempt.questions.partD, answers.partD.answers),
      partE: checkPart(testAttempt.questions.partE, answers.partE.answers),
      partF: checkPartF(testAttempt.questions.partF, answers.partF.answers)
    };
    let totalScore = (scores.partA + scores.partB + scores.partC + scores.partD + scores.partE + scores.partF) / 6;
    testAttempt.scores = {
      ...scores,
      total: totalScore
    };

    await testAttempt.save();

    // Update student's test score
    await Student.findByIdAndUpdate(testAttempt.studentId, {
      testScore: {
        total: totalScore,
        partA: scores.partA,
        partB: scores.partB,
        partC: scores.partC,
        partD: scores.partD,
        partE: scores.partE,
        partF: scores.partF
      },
      testStatus: 'completed'
    });

    res.status(200).json({
      message: "Test submitted successfully",
      scores: testAttempt.scores
    });

  } catch (error) {
    res.status(500).json({ message: "Error submitting test", error: error.message });
  }
};

// find a test based on its ID
exports.findTest = async (req, res) => {
  const { testId } = req.params;

  try {
    const testAttempt = await TestAttempt.findById(testId).populate('studentId', 'name tin');

    if (!testAttempt) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({
      message: "Test found successfully",
      testAttempt
    });
  } catch (error) {
    res.status(500).json({ message: "Error finding test", error: error.message });
  }
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
    // Check if student has an ongoing test
    const ongoingTest = await Student.findOne({
      _id: student._id,
      status: 'started'
    });

    if (ongoingTest) {
      console.log("onfoiinf", ongoingTest);

      return res.status(200).json({
        message: "Ongoing test found",
        testId: ongoingTest._id,
        status: ongoingTest.status,
      });
    }

    // Check if student has already completed a test
    const completedTest = await Student.findOne({
      _id: student._id,
      status: 'completed'
    });

    if (completedTest) {
      console.log("copmeleted", completedTest);
      return res.status(200).json({
        message: "You have already completed this test",
        testId: completedTest._id,
        status: completedTest.status,
      });
    }

    return res.status(200).json({ message: "TIN verified successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.checkSpeed = (req, res) => {
  res.status(200).json({ success: true })
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
