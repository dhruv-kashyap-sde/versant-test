const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
   try {
     const token = req.body.token;
     if (!token) return res.status(401).json({ message: "Unauthorized" });
   
     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
       if (err) return res.status(403).json({ message: "Invalid Token" });
       console.log(decoded);
       req.user = decoded;
       next();
     });
   } catch (error) {
    res.status(401).json({error: error.message});
   }
};

// Route to create a new student
router.post('/students', adminController.createStudent);

// Route to fetch all students
router.get('/students', adminController.getAllStudents);

// Route to delete a student
router.delete('/student/:id', adminController.deleteStudent);

// **Login Route**
router.post("/login", adminController.login);

// **Protected Admin Route**
router.post("/dashboard", verifyToken, adminController.dashboard);

// create admin
// router.post('/create', adminController.createAdmin);

module.exports = router;
