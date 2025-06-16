const Trainer = require("../models/trainer.model");
const Student = require("../models/student.model");
const generateTin = require("../utils/generateTin");

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, alternateId } = req.body;
    const trainerEmail = req.user.email; // Assuming the trainer's email is stored in the token

    const trainer = await Trainer.findOne({ email: trainerEmail });
    // Check if the trainer exists
    if (!trainer) return res.status(404).json({ error: "Trainer not found" });

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }
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

    // Check if trainer has enough TINs left
    if (trainer.tinAmount <= 0) {
      return res.status(400).json({
        error: "Insufficient TIN balance. Please contact administrator to recharge.",
      });
    }

    // Add the generated TIN to the student data
    const student = new Student({
      name,
      email,
      phone,
      alternateId,
      tin,
      createdBy: trainer.name,
      creatorId: trainer._id,
    });
    await student.save();

    // Deduct one TIN from trainer's allocation and save
    trainer.tinRemaining -= 1;
    await trainer.save();

    // Send the TIN to the student's email
    // await sendTinEmail(email, name, tin);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
      remainingTins: trainer.tinAmount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const trainerEmail = req.user.email; // Assuming the trainer's email is stored in the token
    const trainer = await Trainer.findOne({ email: trainerEmail });

    // Check if the trainer exists
    if (!trainer) return res.status(404).json({ error: "Trainer not found" });

    // Fetch all students created by this trainer
    const students = await Student.find({ creatorId: trainer._id });

    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}