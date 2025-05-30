const express = require('express');
const router = express.Router();
const trainerController = require('../controller/trainer.controller');
const { verifyToken } = require('../middleware/verifyToken');

// Route to create a new student by a trainer
router.post('/student', verifyToken, trainerController.createStudent);

// Route to get all students created by that trainer
router.post('/students', verifyToken, trainerController.getStudents);

module.exports = router;
