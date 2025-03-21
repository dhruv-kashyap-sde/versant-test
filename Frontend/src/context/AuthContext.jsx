import axios from "axios";
import React, { createContext, useState, useContext, useRef } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);

  // secrity checks
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [onSecurityPassed, setOnSecurityPassed] = useState(false);

  // States for the individual checks:
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioRecordingCompleted, setAudioRecordingCompleted] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isInternetGood, setIsInternetGood] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const [proceedTest, setProceedTest] = useState(false);
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

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Assign stream to video element for live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Error accessing camera: " + err.message);
    }
  };

  // Initialize microphone
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
      console.log(response.data);

      if (!response.data.success) {
        throw new Error("Resource unavailable");
      }
      const elapsed = Date.now() - startTime;
      // Set a threshold of 300ms for a "good" connection (adjust as needed)
      setIsInternetGood(elapsed < 300);
    } catch (err) {
      console.error("Internet connection check failed:", err);
      setIsInternetGood(false);
    }
  };

  const contextValue = {
    mediaStreamRef, videoRef, 
    isVerified,
    verifyTin,
    error,
    setError,
    isInternetGood,
    setIsInternetGood,
    recordedAudioUrl,
    setRecordedAudioUrl,
    audioRecordingCompleted,
    setAudioRecordingCompleted,
    isMicActive,
    setIsMicActive,
    isCameraActive,
    setIsCameraActive,
    onSecurityPassed,
    setOnSecurityPassed,
    isFullScreen,
    setIsFullScreen,
    checkFullScreen,
    handleFullScreenChange,
    proceedTest, setProceedTest,
    initializeCamera, checkInternetConnection, initializeMic
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
