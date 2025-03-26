const Question = require('../models/question.model');

// Create questions for Part A
exports.createPartAQuestion = async (req, res) => {
    try {
        const { question, questions } = req.body;
        
        // Check if we have single question or array of questions
        if (!question && !questions) {
            return res.status(400).json({ message: 'Question(s) are required' });
        }
        
        // Find existing questions document or create a new one
        let questionDoc = await Question.findOne();
        
        if (!questionDoc) {
            questionDoc = new Question({
                partA: { questions: [] },
                partB: { questions: [] },
                partC: { questions: [] },
                partD: { questions: [] },
                partE: { questions: [] },
                partF: { questions: [] }
            });
        }
        
        // Handle multiple questions
        if (questions && Array.isArray(questions)) {
            questions.forEach(q => {
                if (q && q.question) {
                    questionDoc.partA.questions.push({ question: q.question });
                }
            });
        } 
        // Handle single question
        else if (question) {
            questionDoc.partA.questions.push({ question });
        }
        
        await questionDoc.save();
        
        res.status(201).json({ 
            message: 'Question(s) added to Part A successfully',
            count: questions ? questions.length : 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question(s)', error: error.message });
    }
};

// Create questions for Part B
exports.createPartBQuestion = async (req, res) => {
    try {
        const { question, rearranged, questions } = req.body;
        
        // Check if we have single question or array of questions
        if ((!question || !rearranged) && !questions) {
            return res.status(400).json({ message: 'Question(s) and rearranged version(s) are required' });
        }
        
        // Find existing questions document or create a new one
        let questionDoc = await Question.findOne();
        
        if (!questionDoc) {
            questionDoc = new Question({
                partA: { questions: [] },
                partB: { questions: [] },
                partC: { questions: [] },
                partD: { questions: [] },
                partE: { questions: [] },
                partF: { questions: [] }
            });
        }
        
        // Handle multiple questions
        if (questions && Array.isArray(questions)) {
            questions.forEach(q => {
                if (q && q.question && q.rearranged) {
                    questionDoc.partB.questions.push({ 
                        question: q.question,
                        rearranged: q.rearranged
                    });
                }
            });
        } 
        // Handle single question
        else if (question && rearranged) {
            questionDoc.partB.questions.push({ question, rearranged });
        }
        
        await questionDoc.save();
        
        res.status(201).json({ 
            message: 'Question(s) added to Part B successfully',
            count: questions ? questions.length : 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question(s)', error: error.message });
    }
};

// Create questions for Part C
exports.createPartCQuestion = async (req, res) => {
    try {
        const { question, questions } = req.body;
        
        // Check if we have single question or array of questions
        if (!question && !questions) {
            return res.status(400).json({ message: 'Question(s) are required' });
        }
        
        // Find existing questions document or create a new one
        let questionDoc = await Question.findOne();
        
        if (!questionDoc) {
            questionDoc = new Question({
                partA: { questions: [] },
                partB: { questions: [] },
                partC: { questions: [] },
                partD: { questions: [] },
                partE: { questions: [] },
                partF: { questions: [] }
            });
        }
        
        // Handle multiple questions
        if (questions && Array.isArray(questions)) {
            questions.forEach(q => {
                if (q && q.question) {
                    questionDoc.partC.questions.push({ question: q.question });
                }
            });
        } 
        // Handle single question
        else if (question) {
            questionDoc.partC.questions.push({ question });
        }
        
        await questionDoc.save();
        
        res.status(201).json({ 
            message: 'Question(s) added to Part C successfully',
            count: questions ? questions.length : 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question(s)', error: error.message });
    }
};

// Create questions for Part D
exports.createPartDQuestion = async (req, res) => {
    try {
        const { question, answer, questions } = req.body;
        
        // Check if we have single question or array of questions
        if ((!question || !answer) && !questions) {
            return res.status(400).json({ message: 'Question(s) and answer(s) are required' });
        }
        
        // Find existing questions document or create a new one
        let questionDoc = await Question.findOne();
        
        if (!questionDoc) {
            questionDoc = new Question({
                partA: { questions: [] },
                partB: { questions: [] },
                partC: { questions: [] },
                partD: { questions: [] },
                partE: { questions: [] },
                partF: { questions: [] }
            });
        }
        
        // Handle multiple questions
        if (questions && Array.isArray(questions)) {
            questions.forEach(q => {
                if (q && q.question && q.answer) {
                    questionDoc.partD.questions.push({ 
                        question: q.question,
                        answer: q.answer
                    });
                }
            });
        } 
        // Handle single question
        else if (question && answer) {
            questionDoc.partD.questions.push({ question, answer });
        }
        
        await questionDoc.save();
        
        res.status(201).json({ 
            message: 'Question(s) added to Part D successfully',
            count: questions ? questions.length : 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question(s)', error: error.message });
    }
};

// Create questions for Part E
exports.createPartEQuestion = async (req, res) => {
    try {
        const { question, questions } = req.body;
        
        // Check if we have single question or array of questions
        if (!question && !questions) {
            return res.status(400).json({ message: 'Question(s) are required' });
        }
        
        // Find existing questions document or create a new one
        let questionDoc = await Question.findOne();
        
        if (!questionDoc) {
            questionDoc = new Question({
                partA: { questions: [] },
                partB: { questions: [] },
                partC: { questions: [] },
                partD: { questions: [] },
                partE: { questions: [] },
                partF: { questions: [] }
            });
        }
        
        // Handle multiple questions
        if (questions && Array.isArray(questions)) {
            questions.forEach(q => {
                if (q && q.question) {
                    questionDoc.partE.questions.push({ question: q.question });
                }
            });
        } 
        // Handle single question
        else if (question) {
            questionDoc.partE.questions.push({ question });
        }
        
        await questionDoc.save();
        
        res.status(201).json({ 
            message: 'Question(s) added to Part E successfully',
            count: questions ? questions.length : 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question(s)', error: error.message });
    }
};

// Create questions for Part F
exports.createPartFQuestion = async (req, res) => {
    try {
        const { question, questions } = req.body;
        
        // Check if we have single question or array of questions
        if (!question && !questions) {
            return res.status(400).json({ message: 'Question(s) are required' });
        }
        
        // Find existing questions document or create a new one
        let questionDoc = await Question.findOne();
        
        if (!questionDoc) {
            questionDoc = new Question({
                partA: { questions: [] },
                partB: { questions: [] },
                partC: { questions: [] },
                partD: { questions: [] },
                partE: { questions: [] },
                partF: { questions: [] }
            });
        }
        
        // Handle multiple questions
        if (questions && Array.isArray(questions)) {
            questions.forEach(q => {
                if (q && q.question) {
                    questionDoc.partF.questions.push({ question: q.question });
                }
            });
        } 
        // Handle single question
        else if (question) {
            questionDoc.partF.questions.push({ question });
        }
        
        await questionDoc.save();
        
        res.status(201).json({ 
            message: 'Question(s) added to Part F successfully',
            count: questions ? questions.length : 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question(s)', error: error.message });
    }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findOne();
        
        if (!questions) {
            return res.status(404).json({ message: 'No questions found' });
        }
        
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error: error.message });
    }
};
