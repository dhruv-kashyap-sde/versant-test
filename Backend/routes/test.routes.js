const express = require('express');
const router = express.Router();
const testController = require('../controller/test.controller');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filter files to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Route to begin the student's test
router.post('/start', upload.single('image'), testController.startTest);

// Route to verify the student's tin
router.post('/tin', testController.beginTest);

// Route to submit the test
router.post('/submit', testController.submitTest);

// Route to find a test based on its ID
router.get('/test/:testId', testController.findTest);

// Route to do the speed test
router.get('/check-speed', testController.checkSpeed);

// Route to get the test attempt details
// router.get('/attempt/:testId', testController.getTestAttempt);

module.exports = router;
