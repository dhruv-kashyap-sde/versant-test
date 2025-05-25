const Trainer = require("../models/trainer.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find trainer by email
    const trainer = await Trainer.findOne({ email }).select("+password");
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Compare passwords
    const isMatch = await trainer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = trainer.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      token,
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}