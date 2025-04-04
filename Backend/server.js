// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const speech = require("@google-cloud/speech");
const Levenshtein = require("fast-levenshtein");
const natural = require('natural');
const similarity = require('string-similarity');
const { NlpManager } = require('node-nlp');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.routes');
const testRoutes = require('./routes/test.routes');
const questionRoutes = require('./routes/questions.routes');
const connectDB = require("./config/db.config");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://versant-test-qxvv.onrender.com"],  // Change this to match your frontend port
  methods: ["GET", "POST", "PUT", "DELETE"],}));
app.use(bodyParser.json());
app.use('/api/admin', adminRoutes);
app.use('/api/', testRoutes);
app.use('/api/questions', questionRoutes);
connectDB();

app.get("/", (req, res) => {
  res.send('Hello World!');
})

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// server.js (continued)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
