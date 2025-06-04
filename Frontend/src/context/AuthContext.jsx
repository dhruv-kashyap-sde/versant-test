import axios from "axios";
import React, { createContext, useState, useContext, useRef } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);

  // secrity checks
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [onSecurityPassed, setOnSecurityPassed] = useState(false);
  const [partIndex, setPartIndex] = useState(-1);

  const handleContinue = () => {
    setPartIndex(i => i + 1);
  };

  const [student, setStudent] = useState({});

  // states for questions fetched from database
  const [testQuestions, setTestQuestions] = useState([]);
  const [testId, setTestId] = useState("");
  const [loading, setLoading] = useState(false);

  // States for the individual checks:
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioRecordingCompleted, setAudioRecordingCompleted] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isInternetGood, setIsInternetGood] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const [proceedTest, setProceedTest] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Add camera-related states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [faceDetectionError, setFaceDetectionError] = useState(null);

  // test report log 
  const [testReport, setTestReport] = useState({
    studentId: "",
    testId: "", 
    testStartTime: "",
    testEndTime: "",
    testLog: []
  })

  const verifyTin = () => {
    setIsVerified(true);
  };

  // Check full screen mode
  const checkFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => {
          console.error("Error enabling full screen mode:", err);
          setError("Error enabling full screen mode: " + err.message);
        });
    } else {
      setIsFullScreen(true);
    }
  };

  // Handle full screen change
  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  };

  const initializeMic = async () => {
    try {
      const constraints = { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Check microphone presence
      if (stream.getAudioTracks().length > 0) {
        setIsMicActive(true);
      } else {
        setIsMicActive(false);
        setError("Microphone not detected.");
      }

      // Start recording an audio sample
      startAudioRecording(stream);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Error accessing microphone: " + err.message);
    }
  };

  // Record a 5-second audio sample using MediaRecorder
  const startAudioRecording = (stream) => {
    let chunks = [];
    try {
      const options = { mimeType: "audio/webm" };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudioUrl(audioUrl);
        setAudioRecordingCompleted(true);
      };

      recorder.start();
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 5000);
    } catch (err) {
      console.error("Audio recording error:", err);
      setError("Audio recording error: " + err.message);
    }
  };

  // Check internet connection performance
  const checkInternetConnection = async () => {
    try {
      const startTime = Date.now();
      // Fetch a lightweight resource; adjust URL as needed (e.g., your server's favicon)
      const response = await axios.get(
        `${import.meta.env.VITE_API}/check-speed`
      );
      // console.log(response.data);

      if (!response.data.success) {
        throw new Error("Resource unavailable");
      }
      const elapsed = Date.now() - startTime;
      // Set a threshold of 300ms for a "good" connection (adjust as needed)
      setIsInternetGood(elapsed < 300);
    } catch (err) {
      console.error("Internet connection check failed:", err);
      setIsInternetGood(true);
    }
  };

  const voices = window.speechSynthesis.getVoices();
  const speakingVoice = voices[0];
  
  // Updated totalScore state to be an array of objects
  const [totalScore, setTotalScore] = useState({
    partA: { answers: [] },
    partB: { answers: [] },
    partC: { answers: [] },
    partD: { answers: [] },
    partE: { answers: [] },
    partF: { answers: [] },
});
  
  // New function to update only the score for a specific part by pushing new answers to the array
  const updatePartScore = (part, newAnswer) => {
    // Convert single character part (like 'A') to the full key name (like 'partA')
    const partKey = `part${part}`;
    
    setTotalScore(prevScores => ({
      ...prevScores,
      [partKey]: {
      ...prevScores[partKey],
      answers: [...prevScores[partKey].answers, newAnswer]
      }
    }));
  };

  // Initialize camera function
  const initializeCamera = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Connect the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
      } else {
        setError("Video element not available");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Error accessing camera: " + err.message);
      setIsCameraActive(false);
    }
  };

  // Take a photo using the camera
  const capturePhoto = () => {
    if (!videoRef.current || !isCameraActive) {
      setError("Camera must be active to take a photo");
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to image URL
      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImageUrl(imageUrl);
      setPhotoTaken(true);
    } catch (err) {
      console.error("Error capturing photo:", err);
      setError("Failed to capture photo: " + err.message);
    }
  };

  // Function to remove all security checks
  const removeAllChecks = () => {
    setIsMicActive(false);
    setAudioRecordingCompleted(false);
    setRecordedAudioUrl(null);
    setIsInternetGood(false);
    setIsFullScreen(false);
    setOnSecurityPassed(false);
    setError(null);
    setIsCameraActive(false);
    setPhotoTaken(false);
    setCapturedImageUrl(null);
    
    // Stop any active media streams
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  };

  // Function to convert base64 image to blob
  const base64ToBlob = async (base64Url) => {
    try {
      const response = await fetch(base64Url);
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.error("Error converting image:", err);
      throw new Error("Failed to process image: " + err.message);
    }
  };

  const contextValue = {
    totalScore, setTotalScore,
    updatePartScore,
    mediaStreamRef, videoRef, 
    isVerified, verifyTin,
    error, setError,
    isInternetGood, setIsInternetGood,
    recordedAudioUrl, setRecordedAudioUrl,
    audioRecordingCompleted, setAudioRecordingCompleted,
    isMicActive, setIsMicActive,
    onSecurityPassed, setOnSecurityPassed,
    isFullScreen, setIsFullScreen,
    checkFullScreen, handleFullScreenChange,
    proceedTest, setProceedTest,
    checkInternetConnection, initializeMic,
    speakingVoice,
    loading, setLoading,
    testQuestions, setTestQuestions,
    student, setStudent,
    testId, setTestId,
    partIndex, setPartIndex,
    handleContinue,
    currentUser, setCurrentUser,
    isCameraActive, setIsCameraActive,
    photoTaken, setPhotoTaken,
    capturedImageUrl, setCapturedImageUrl,
    initializeCamera, capturePhoto,
    removeAllChecks, // Add the removeAllChecks function to context
    base64ToBlob,
    testReport, setTestReport,
    faceDetectionError, setFaceDetectionError
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
