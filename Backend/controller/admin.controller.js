const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const generateTin = require("../utils/generateTin");
const { sendTinEmail } = require("../utils/emailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const xlsx = require('xlsx');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, alternateId } = req.body;

    let tin;
    let tinExists = true;

    // Generate a unique TIN and check if it already exists in the database
    while (tinExists) {
      tin = generateTin();
      const existingStudent = await Student.findOne({ tin });
      if (!existingStudent) {
        tinExists = false;
      }
    }

    // Check if a student with the same email or phone already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingStudent) {
      return res
        .status(400)
        .json({ error: "Student with this email or phone already exists" });
    }

    // Add the generated TIN to the student data
    const student = new Student({ name, email, phone, alternateId, tin });
    await student.save();
    
    // Send the TIN to the student's email
    await sendTinEmail(email, name, tin);
    
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ message: "Please add all the Fields" });
  }

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    if (email !== admin.email)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);

    res.json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dashboard = async (req, res) => {
  let { email } = req.user;
  let admin = await Admin.findOne({ email });

  if (!admin) return res.status(401).json({ message: "User not found" });

  res.json({ message: "Welcome to Admin Dashboard", success: true });
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Import students from Excel file
exports.importStudentsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an Excel file" });
    }

    const filePath = req.file.path;
    
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        // Delete the file after processing
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Excel file is empty" });
      }

      const results = {
        success: [],
        errors: [],
        emailErrors: []
      };

      for (const row of data) {
        try {
          const { name, email, phone, alternateId } = row;

          // Validate required fields
          if (!name || !email || !phone) {
            results.errors.push({
              row,
              error: "Missing required fields (name, email, or phone)"
            });
            continue;
          }

          // Check if a student with the same email or phone already exists
          const existingStudent = await Student.findOne({
            $or: [{ email }, { phone }],
          });

          if (existingStudent) {
            results.errors.push({
              row,
              error: "Student with this email or phone already exists"
            });
            continue;
          }

          // Generate a unique TIN
          let tin;
          let tinExists = true;
          let equalsto10 = true;
          while (tinExists) {
            while (equalsto10) {
              tin = generateTin();
              if (tin.length === 10) {
                equalsto10 = false;
              }
            }
            const existingStudentWithTin = await Student.findOne({ tin });
            if (!existingStudentWithTin) {
              tinExists = false;
            }
          }

          // Create and save the student
          const student = new Student({ name, email, phone, alternateId, tin });
          await student.save();
          
          // Send the TIN to the student's email
          const emailSent = await sendTinEmail(email, name, tin);
          
          if (!emailSent) {
            results.emailErrors.push({
              student: student._id,
              email,
              message: "Failed to send TIN email"
            });
          }
          
          results.success.push(student);
        } catch (error) {
          results.errors.push({
            row,
            error: error.message
          });
        }
      }

      // Delete the file after processing
      fs.unlinkSync(filePath);

      res.status(201).json({
        message: `Imported ${results.success.length} students successfully. ${results.errors.length} errors. ${results.emailErrors.length} email sending errors.`,
        success: results.success,
        errors: results.errors,
        emailErrors: results.emailErrors
      });
    } catch (excelError) {
      console.error("Error processing Excel file:", excelError);
      res.status(400).json({ error: "Error processing Excel file: " + excelError.message });
      
      // Clean up the file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error in importStudentsFromExcel:", error);
    
    // Delete the file if it exists and there was an error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: error.message });
  }
};

// Reset a student's test status to allow them to take the test again
exports.resetStudentTestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Find the student and update their test status
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Reset test status and scores
    student.testStatus = 'not started';
    student.testScore = {
      total: 0,
      partA: 0,
      partB: 0,
      partC: 0,
      partD: 0,
      partE: 0,
      partF: 0
    };

    await student.save();

    res.status(200).json({
      message: "Student test status reset successfully",
      student,
    });
  } catch (error) {
    console.error('Error resetting student test status:', error);
    res.status(500).json({ message: "Error resetting student test status", error: error.message });
  }
};
