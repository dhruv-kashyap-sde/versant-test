const express = require('express');
const router = express.Router();
const testController = require('../controller/test.controller');

// Route to begin the student's test
router.post('/tin', testController.beginTest);

// Route to check internet speed
router.get('/check-speed', testController.checkSpeed);

module.exports = router;
