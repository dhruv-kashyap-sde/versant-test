const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const generateTin = require("../utils/generateTin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

//create an admin
// exports.createAdmin = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(404).json({ message: "Please add all the Fields" });
//   }

//   try {
//     bcrypt.hash(password, 10, async (err, hash) => {
//       let admin = await Admin.findOne({ email });
//       if (admin) res.status(401).send("user already exists");
//       const newAdmin = await Admin.create({ email, password: hash });
//       console.log(newAdmin);
//       let token = jwt.sign(
//         { email: newAdmin.email },
//         process.env.JWT_SECRET_KEY
//       );
//       console.log(token);
//       res.cookie("token", token);
//       res.status(201).send("User registered");
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
