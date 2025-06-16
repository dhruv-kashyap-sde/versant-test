const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const generateTin = require("../utils/generateTin");
const { sendTinEmail } = require("../utils/emailService");
const { sendTeacherCredentialsEmail } = require('../utils/emailService');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const fs = require("fs");
const nodemailer = require("nodemailer");
const Trainer = require("../models/trainer.model");
const testAttemptModel = require("../models/testAttempt.model");

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
    const student = new Student({
      name,
      email,
      phone,
      alternateId,
      tin,
      createdBy: "Admin",
    });
    await student.save();

    // Send the TIN to the student's email
    // await sendTinEmail(email, name, tin);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all details of a student by ID
exports.getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    // Find the student by ID
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    // Fetch test attempts for the student
    const testAttempts = await testAttemptModel.find({ studentId: student._id });
    if (!testAttempts || testAttempts.length === 0) {
      return res.status(404).json({ error: "No test attempts found for this student" });
    }

    res.status(200).json({ student, testAttempts });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: error.message });
  }
}

// Create new Trainer
exports.createTrainer = async (req, res) => {
  try {
    const { name, email, phone, tinAmount, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !tinAmount || !password) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (name, email, phone, tinAmount, password)",
      });
    }


    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number",
      });
    }

    // Validate tinAmount is a positive number
    if (isNaN(tinAmount) || Number(tinAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "TIN amount must be a positive number",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters long",
      });
    }

    // Store plain password before hashing (if you're hashing it)
    const plainTextPassword = password;


    // Check if trainer with the same email or phone already exists
    const existingTrainer = await Trainer.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer with this email or phone already exists",
      });
    }

    // Create and save the trainer
    const trainer = new Trainer({
      name,
      email,
      phone,
      tinAmount: Number(tinAmount),
      password,
      tinRemaining: Number(tinAmount), // Initialize tinRemaining with the same amount
    });

    await trainer.save();

    // Send email with credentials after successful creation
    const emailResult = await sendTeacherCredentialsEmail(trainer, plainTextPassword);

    if (!emailResult.success) {
      console.warn('Trainer created but email failed to send:', emailResult.error);
    }

    // Return success without sending back the password
    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        tinAmount: trainer.tinAmount,
        tinRemaining: trainer.tinRemaining,
        createdAt: trainer.createdAt,
      },
      emailSent: emailResult.success

    });
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create trainer",
      error: error.message,
    });
  }
};

// Delete a trainer by ID
exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Trainer ID is required" });
    }

    // Find and delete the trainer
    const deletedTrainer = await Trainer.findByIdAndDelete(id);

    if (!deletedTrainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ error: error.message });
  }
}

// Fetch all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainer = await Trainer.find();
    res.status(200).json(trainer);
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
    return res.status(400).json({ message: "Please add all the Fields" });
  }

  try {
    // First check if it's an admin
    let admin = await Admin.findOne({ email });
    if (admin) {
      // Verify admin password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token for admin
      const token = jwt.sign(
        { email, role: "admin", userId: admin._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login successful",
        success: true,
        token,
        role: "admin",
        userData: {
          id: admin._id,
          email: admin.email,
          username: admin.username,
        },
      });
    }

    // If not admin, check if it's a trainer
    let trainer = await Trainer.findOne({ email }).select("+password");
    if (trainer) {
      // Verify trainer password
      const isMatch = await trainer.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token for trainer
      const token = jwt.sign(
        { email, role: "trainer", userId: trainer._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login successful",
        success: true,
        token,
        role: "trainer",
        userData: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          tinAmount: trainer.tinAmount,
        },
      });
    }

    // If neither admin nor trainer
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.dashboard = async (req, res) => {
  let { email } = req.user;
  let admin = await Admin.findOne({ email });

  if (admin) {
    res.json({ message: "Welcome to Admin Dashboard", success: true });
  }

  let trainer = await Trainer.findOne({ email });
  if (trainer) {
    res.json({
      message: "Welcome to Trainer Dashboard",
      success: true,
      trainer
    });
  }
  // If neither admin nor trainer is found
  if (!admin && !trainer) {
    return res.status(404).json({ message: "User not found" });
  }

};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student first to check who created it
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if student was created by a trainer
    if (student.createdBy !== "Admin") {
      // Find the trainer by name
      const trainer = await Trainer.findById(student.creatorId);

      if (trainer) {
        // Increment the trainer's remaining TIN count
        trainer.tinRemaining += 1;
        await trainer.save();
      }
    }

    // Delete the student
    await Student.findByIdAndDelete(id);

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting student:", error);
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
        emailErrors: [],
      };

      for (const row of data) {
        try {
          const { name, email, phone, alternateId } = row;

          // Validate required fields
          if (!name || !email || !phone) {
            results.errors.push({
              row,
              error: "Missing required fields (name, email, or phone)",
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
              error: "Student with this email or phone already exists",
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
          const student = new Student({
            name,
            email,
            phone,
            alternateId,
            tin,
            createdBy: "Admin",
          });
          await student.save();

          // Send the TIN to the student's email
          // const emailSent = await sendTinEmail(email, name, tin);

          // if (!emailSent) {
          //   results.emailErrors.push({
          //     student: student._id,
          //     email,
          //     message: "Failed to send TIN email"
          //   });
          // }

          results.success.push(student);
        } catch (error) {
          results.errors.push({
            row,
            error: error.message,
          });
        }
      }

      // Delete the file after processing
      fs.unlinkSync(filePath);

      res.status(201).json({
        message: `Imported ${results.success.length} students successfully. ${results.errors.length} errors. ${results.emailErrors.length} email sending errors.`,
        success: results.success,
        errors: results.errors,
        emailErrors: results.emailErrors,
      });
    } catch (excelError) {
      console.error("Error processing Excel file:", excelError);
      res
        .status(400)
        .json({ error: "Error processing Excel file: " + excelError.message });

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
    student.testStatus = "not started";
    student.testScore = {
      total: 0,
      partA: 0,
      partB: 0,
      partC: 0,
      partD: 0,
      partE: 0,
      partF: 0,
    };

    await student.save();

    res.status(200).json({
      message: "Student test status reset successfully",
      student,
    });
  } catch (error) {
    console.error("Error resetting student test status:", error);
    res
      .status(500)
      .json({
        message: "Error resetting student test status",
        error: error.message,
      });
  }
};

// Create a transporter using the provided Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: "bulk.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "smtp@mailtrap.io",
    pass: "63acd31e23c1614b751786702f09feb0",
  },
});

// Controller for sending invitation emails to students
exports.sendInvitations = async (req, res) => {
  try {
    const { studentIds } = req.body;

    // Validation
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No students selected" });
    }

    // Find students by IDs
    const students = await Student.find({ _id: { $in: studentIds } });

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No valid students found" });
    }

    // Send invitation emails
    const emailPromises = students.map(async (student) => {
      const mailOptions = {
        from: "skillvedaaassessment@morlingglobal.in",
        to: student.email,
        subject: "Your Test Identification Number (TIN)",
        html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          "
        >
          <h2 style="color: #333">Hello ${student.name},</h2>
          <p>
            Your Test Identification Number (TIN) has
            been generated. You are now eligible for test.
          </p>
          <div
            style="
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            "
          >
            <h4>Please follow the pre-requisite conditions:</h4>
            <ul style="list-style-type: disc; padding-left: 20px">
              <li>You must have a good internet Connection</li>
              <li>Use a laptop or desktop computer</li>
              <li>Use Google Chrome or Microsoft Edge browser</li>
              <li>Ensure your microphone and camera are working</li>
              <li>You can give test only <strong>once.</strong></li>
            </ul>
          </div>
          <div
            style="
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
              margin: 20px 0;
            "
          >
            <h3 style="margin: 0; color: #007bff; font-size: 24px">${student.tin}</h3>
          </div>
          <p>
            Please keep this TIN secure as you will need it to access your test.
          </p>
          <p>If you have any questions, please contact the administrator.</p>
          <p style="margin-top: 20px; font-size: 14px; color: #666">
            This is an automated message, please do not reply.
          </p>
          <a href="https://vna.skillvedaa.in/" style="color: #007bff; text-decoration: none; font-weight: bold;">
            Click here to access your test
          </a>
        </div>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      message: `Invitations sent successfully to ${students.length} students`,
    });
  } catch (error) {
    console.error("Error sending invitations:", error);
    res.status(500).json({
      success: false,
      message: "Error sending invitations",
      error: error.message,
    });
  }
};
