const express = require('express');
const router = express.Router();
const testController = require('../controller/test.controller');

// Route to begin the student's test
router.post('/start', testController.startTest);

// Route to verify the student's tin
router.post('/tin', testController.beginTest);

// Route to submit the test
router.post('/submit', testController.submitTest);

// Route to find a test based on its ID
router.get('/test/:testId', testController.findTest);

// Route to do the speed test
router.get('/check-speed', testController.checkSpeed);

// Route to get the test attempt details
// router.get('/attempt/:testId', testController.getTestAttempt);

module.exports = router;
