const express = require('express');
const router = express.Router();
const questionsController = require('../controller/questions.controller');

// create questions for part A
router.post('/partA', questionsController.createPartAQuestion);

// create questions for partB
router.post('/partB', questionsController.createPartBQuestion);

// create questions for partC
router.post('/partC', questionsController.createPartCQuestion);

// create questions for partD
router.post('/partD', questionsController.createPartDQuestion);

// create questions for partE
router.post('/partE', questionsController.createPartEQuestion);

// create questions for partF
router.post('/partF', questionsController.createPartFQuestion);

// get all the questions
router.get('/', questionsController.getAllQuestions);

module.exports = router;