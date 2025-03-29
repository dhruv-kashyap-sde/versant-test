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
            count: questions ? questions.length : 1,
            questions: questionDoc.partA.questions
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
            count: questions ? questions.length : 1,
            questions: questionDoc.partB.questions
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

        // Validate dialog structure
        const isValidDialog = (dialog) => {
            return dialog && 
                   Array.isArray(dialog) && 
                   dialog.length > 0 && 
                   dialog.every(d => 
                       typeof d === 'object' && 
                       typeof d.speaker === 'string' && 
                       typeof d.text === 'string'
                   );
        };

        // Validate single question structure
        const isValidQuestion = (q) => {
            return q && 
                   isValidDialog(q.dialog) &&
                   typeof q.question === 'string' &&
                   Array.isArray(q.keywords) &&
                   q.keywords.length > 0 &&
                   q.keywords.every(k => typeof k === 'string');
        };

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
            const validQuestions = questions.filter(q => isValidQuestion(q));
            
            if (validQuestions.length === 0) {
                return res.status(400).json({ 
                    message: 'No valid questions found in the array. Each question must have dialog (with speaker and text), question text, and keywords.' 
                });
            }

            validQuestions.forEach(q => {
                const formattedQuestion = {
                    dialog: q.dialog.map(d => ({
                        speaker: d.speaker.trim(),
                        text: d.text.trim()
                    })),
                    question: q.question.trim(),
                    keywords: q.keywords.map(k => k.trim())
                };
                questionDoc.partC.questions.push(formattedQuestion);
            });
        }
        // Handle single question
        else if (question) {
            if (!isValidQuestion(question)) {
                return res.status(400).json({ 
                    message: 'Invalid question format. Question must have dialog (with speaker and text), question text, and keywords.' 
                });
            }

            const formattedQuestion = {
                dialog: question.dialog.map(d => ({
                    speaker: d.speaker.trim(),
                    text: d.text.trim()
                })),
                question: question.question.trim(),
                keywords: question.keywords.map(k => k.trim())
            };
            questionDoc.partC.questions.push(formattedQuestion);
        }

        await questionDoc.save();

        res.status(201).json({
            message: 'Question(s) added to Part C successfully',
            count: questions ? questions.filter(q => isValidQuestion(q)).length : 1,
            questions: questionDoc.partC.questions
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

// Get random questions for the test
exports.getRandomQuestions = async (req, res) => {
    try {
        const questions = await Question.findOne();
        
        if (!questions) {
            return res.status(404).json({ message: 'No questions found' });
        }
        
        // Function to get random elements from an array
        const getRandomElements = (array, count) => {
            const shuffled = [...array].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, array.length));
        };

        // Collect 2 random questions from each part
        const randomQuestions = {
            partA: getRandomElements(questions.partA.questions, 2),
            partB: getRandomElements(questions.partB.questions, 2),
            partC: getRandomElements(questions.partC.questions, 2),
            partD: getRandomElements(questions.partD.questions, 2),
            partE: getRandomElements(questions.partE.questions, 2),
            partF: getRandomElements(questions.partF.questions, 2)
        };

        // Check if we have questions for each part
        const partsWithoutQuestions = [];
        for (const part of ['A', 'B', 'C', 'D', 'E', 'F']) {
            const partKey = `part${part}`;
            if (randomQuestions[partKey].length < 1) {
                partsWithoutQuestions.push(part);
            }
        }

        if (partsWithoutQuestions.length > 0) {
            return res.status(404).json({ 
                message: `Not enough questions found for part(s): ${partsWithoutQuestions.join(', ')}` 
            });
        }
        
        res.status(200).json(randomQuestions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error: error.message });
    }
};

// Get questions by part or all questions
exports.getQuestionsByPart = async (req, res) => {
    try {
        const { part } = req.query;
        const questions = await Question.findOne();
        
        if (!questions) {
            return res.status(404).json({ message: 'No questions found' });
        }

        // If no specific part is requested, return all questions
        if (!part) {
            return res.status(200).json(questions);
        }

        // Validate the part parameter
        const validParts = ['A', 'B', 'C', 'D', 'E', 'F'];
        if (!validParts.includes(part.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid part. Must be one of: A, B, C, D, E, F' });
        }

        const partKey = `part${part.toUpperCase()}`;
        
        if (!questions[partKey] || questions[partKey].questions.length === 0) {
            return res.status(404).json({ message: `No questions found for Part ${part.toUpperCase()}` });
        }
        
        res.status(200).json(questions[partKey]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error: error.message });
    }
};

// Delete a question by ID
exports.deleteQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { part } = req.query;
        console.log('Delete question ID:', id, 'from part:', part);
        
        if (!id) {
            return res.status(400).json({ message: 'Question ID is required' });
        }
        
        if (!part || !['A', 'B', 'C', 'D', 'E', 'F'].includes(part.toUpperCase())) {
            return res.status(400).json({ message: 'Valid part (A, B, C, D, E, F) is required' });
        }

        const partKey = `part${part.toUpperCase()}.questions`;
        
        // Use MongoDB's pull operator to remove the specific question by its ID
        const result = await Question.findOneAndUpdate(
            { [`${partKey}._id`]: id },
            { $pull: { [partKey]: { _id: id } } },
            { new: true }
        );
        
        if (!result) {
            return res.status(404).json({ message: `Question with ID ${id} not found in part ${part}` });
        }
        
        res.status(200).json({ 
            message: `Question deleted successfully from part ${part}`,
            updatedQuestions: result
        });
    } catch (error) {
        console.error('Error in deleteQuestionById:', error);
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};