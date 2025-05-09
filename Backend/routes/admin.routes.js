const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const upload = require('../config/fileUpload');
const { verifyToken } = require('../middleware/verifyToken');


// Route to create a new student
router.post('/students', adminController.createStudent);

// Route to fetch all students
router.get('/students', adminController.getAllStudents);

// Route to delete a student
router.delete('/student/:id', adminController.deleteStudent);

// Reset a student's test status
router.post('/student/:id/reset', adminController.resetStudentTestStatus);

// Bulk import students from Excel file
router.post('/students/import', upload.single('file'), adminController.importStudentsFromExcel);

// **Login Route**
router.post("/login", adminController.login);

// **Protected Admin Route**
router.post("/dashboard", verifyToken, adminController.dashboard);

// create admin
// router.post('/create', adminController.createAdmin);

module.exports = router;
