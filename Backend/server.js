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
const connectDB = require("./config/db.config");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/admin', adminRoutes);
app.use('/api/', testRoutes);
connectDB();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// server.js (continued)

app.post("/api/upload", upload.single("audio"), async (req, res) => {
  const audioBuffer = req.file.buffer;

  // Initialize the Google Cloud client
  const client = new speech.SpeechClient();

  // Configure the request
  const audioBytes = audioBuffer.toString("base64");
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 44100, // Adjust based on your recording settings
    languageCode: "en-US",
  };
  const request = {
    audio: audio,
    config: config,
  };

  try {
    // Perform transcription
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    // Proceed to analyze transcription
    const expectedSentence = "The quick brown fox jumps over the lazy dog.";
    const transcribedSentence = transcription;

    // Calculate Levenshtein distance
    const distance = Levenshtein.get(
      expectedSentence.toLowerCase(),
      transcribedSentence.toLowerCase()
    );

    const maxLen = Math.max(
      expectedSentence.length,
      transcribedSentence.length
    );

    const similarityScore = ((maxLen - distance) / maxLen) * 100;

    // Normalize if necessary
    const normalizedScore = Math.min(Math.max(similarityScore, 0), 100);

    // Send the scores back to the frontend
    res.json({
      success: true,
      transcription,
      similarityScore,
      totalScore: normalizedScore,
      nextQuestionId: 'abcd123'
    });
    
  } catch (error) {
    console.error("Error during transcription:", error);
    res.status(500).send("Error during transcription");
  }
});

// for part B - sentence build 
app.post('/api/submit-sentence-build', upload.single('audio'), async (req, res) => {
  const audioBuffer = req.file.buffer;

  // Initialize the Google Cloud Speech client
  const client = new speech.SpeechClient();

  // Configure the request
  const audioBytes = audioBuffer.toString('base64');
  const audio = { content: audioBytes };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100, // Adjust based on your recording settings
    languageCode: 'en-US',
  };
  const request = { audio, config };

  try {
    // Perform transcription
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join(' ');
    
    // Expected sentence (the correct rearranged sentence)
    const expectedSentence = 'This is the correct sentence.';
    
    // Calculate similarity
    const distance = Levenshtein.get(
      expectedSentence.toLowerCase(),
      transcription.toLowerCase()
    );
    const maxLen = Math.max(expectedSentence.length, transcription.length);
    const similarityScore = ((maxLen - distance) / maxLen) * 100;

    // Assign score based on similarity
    const score = similarityScore;

    // Optionally, evaluate pronunciation and fluency (see Part A)

    // Save response to database (not shown here)

    res.json({ success: true, transcription, similarityScore, score });
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).send('Error during transcription');
  }
});

// for part C - conversation
app.post('/api/submit-conversation', upload.single('audio'), async (req, res) => {
  const audioBuffer = req.file.buffer;

  // Initialize the Google Cloud Speech client
  const client = new speech.SpeechClient();

  // Configure the request
  const audioBytes = audioBuffer.toString('base64');
  const audio = { content: audioBytes };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
  };
  const request = { audio, config };

  try {
    // Perform transcription
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join(' ');
    
    // Acceptable answers (could be loaded from your database)
    const correctAnswers = ['the correct answer', 'an acceptable alternative'];

    // Normalize transcription
    const candidateAnswer = transcription.trim().toLowerCase();

    // Check if the candidate's answer matches any of the correct answers
    const isCorrect = correctAnswers.some(
      (answer) => answer === candidateAnswer
    );

    // Optionally, use NLP techniques to handle synonyms and close matches

    // Assign score
    const score = isCorrect ? 100 : 0;

    // Optionally, evaluate pronunciation and fluency (see Part A)

    // Save response to database (not shown here)

    res.json({ success: true, transcription, isCorrect, score });
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).send('Error during transcription');
  }
});

// for part D - fill in the blanks
app.post('/api/submit-sentence-completion', async (req, res) => {
  const { word } = req.body;
  const correctWords = ['correct', 'acceptable'];

  const candidateWord = word.trim().toLowerCase();

  const isCorrect = correctWords.includes(candidateWord);

  // Optionally, use synonyms
  // Use a thesaurus API to check for synonyms

  const score = isCorrect ? 100 : 0;

  // Save response to database
  const responseRecord = new Response({
    userResponse: candidateWord,
    isCorrect,
    score,
  });
  await responseRecord.save();

  res.json({ success: true, score });
});

// for part E - dictation
app.post('/api/submit-dictation', async (req, res) => {
  const { typedSentence } = req.body;
  const correctSentence = 'This is the correct sentence.';

  // Normalize sentences
  const candidateSentence = typedSentence.trim().toLowerCase();
  const expectedSentence = correctSentence.trim().toLowerCase();

  // Calculate Levenshtein distance
  const distance = natural.LevenshteinDistance(candidateSentence, expectedSentence);
  const maxLen = Math.max(candidateSentence.length, expectedSentence.length);
  const accuracy = ((maxLen - distance) / maxLen) * 100;

  // Assign score based on accuracy
  const score = accuracy;

  // Save response to database
  const responseRecord = new Response({
    userResponse: candidateSentence,
    expectedResponse: expectedSentence,
    score,
  });
  await responseRecord.save();

  res.json({ success: true, score });
});

// for part F - passage reconstruction
app.post('/api/submit-passage-reconstruction', async (req, res) => {
  const { reconstructedText } = req.body;
  const originalPassage = 'This is the original passage text.';

  // Content Similarity
  const contentSimilarity = similarity.compareTwoStrings(
    reconstructedText,
    originalPassage
  ) * 100;

  // Language Use (Optional)
  const manager = new NlpManager({ languages: ['en'] });
  await manager.process('en', reconstructedText);
  const languageScore = 80; // Placeholder for actual analysis

  // Assign scores
  const contentScore = contentSimilarity; // e.g., 0-100%
  const finalScore = (contentScore * 0.7) + (languageScore * 0.3);

  // Save response to database
  const responseRecord = new Response({
    userResponse: reconstructedText,
    contentScore,
    languageScore,
    finalScore,
  });
  await responseRecord.save();

  res.json({ success: true, finalScore });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
