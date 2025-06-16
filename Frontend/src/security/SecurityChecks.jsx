import axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
import "./Security.css";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import FaceMonitor from "./FaceMonitor";
import * as faceapi from "face-api.js";
import { filterValidDetections, getOptimalDetectionOptions } from "../utils/faceDetectionUtils";

const SecurityChecks = () => {
  const {
    videoRef,
    mediaStreamRef,
    isMicActive,
    setIsMicActive,
    audioRecordingCompleted,
    setAudioRecordingCompleted,
    recordedAudioUrl,
    setRecordedAudioUrl,
    isInternetGood,
    setIsInternetGood,
    error,
    setError,
    onSecurityPassed,
    setOnSecurityPassed,
    isFullScreen,
    checkFullScreen,
    handleFullScreenChange,
    proceedTest,
    setProceedTest,
    checkInternetConnection,
    initializeMic,
    // Add new context values
    isCameraActive,
    photoTaken,
    capturedImageUrl,
    initializeCamera,
    capturePhoto,
    // Add speech test values
    speechTestCompleted,
    speechTestSentence,
    transcribedText,
    isSpeechTestActive,
    startSpeechTest,
    initializeSpeechRecognition,
  } = useContext(AuthContext);
  const [faceDetected, setFaceDetected] = useState(false);
  const detectionRef = useRef({
    consecutiveNoFaceCount: 0,
    consecutiveMultiFaceCount: 0,
    consecutiveValidCount: 0
  });
  
  // Run the security checks on mount
  useEffect(() => {
    initializeMic();
    checkInternetConnection();
    checkFullScreen();

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };

    // Initialize speech recognition
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      // Speech recognition will be initialized when startSpeechTest is called
    } else {
      toast.error("Speech recognition not supported in this browser");
    }

    loadModels().then(initializeCamera());
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions(getOptimalDetectionOptions())
          );

          const validDetections = filterValidDetections(detections, videoRef.current);

          if (validDetections.length === 0) {
            detectionRef.current.consecutiveNoFaceCount++;
            detectionRef.current.consecutiveMultiFaceCount = 0;
            detectionRef.current.consecutiveValidCount = 0;
            
            // Only show error after 2 consecutive failures (4 seconds)
            if (detectionRef.current.consecutiveNoFaceCount >= 2) {
              if (detectionRef.current.consecutiveNoFaceCount === 2) {
                toast.error("Please position yourself in front of the camera");
              }
              setFaceDetected(false);
            }
          } else if (validDetections.length > 1) {
            detectionRef.current.consecutiveMultiFaceCount++;
            detectionRef.current.consecutiveNoFaceCount = 0;
            detectionRef.current.consecutiveValidCount = 0;
            
            // Only show error after 2 consecutive detections (4 seconds)
            if (detectionRef.current.consecutiveMultiFaceCount >= 2) {
              if (detectionRef.current.consecutiveMultiFaceCount === 2) {
                toast.error("Multiple faces detected - Ensure only you are visible");
              }
              setFaceDetected(false);
            }
          } else {
            // Valid single face detected
            detectionRef.current.consecutiveValidCount++;
            detectionRef.current.consecutiveNoFaceCount = 0;
            detectionRef.current.consecutiveMultiFaceCount = 0;
            
            // Need at least 2 consecutive valid detections to be sure
            if (detectionRef.current.consecutiveValidCount >= 2) {
              setFaceDetected(true);
            }
          }
        } catch (error) {
          console.error("Face detection error:", error);
          // Don't immediately fail on detection errors
        }
      }
    }, 2000); // Every 2 seconds

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // On unmount, stop all media tracks and remove event listener
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      clearInterval(interval);
    };
  }, []);
  // When all checks pass, trigger the callback for further action (e.g., starting the test)
  useEffect(() => {
    if (
      isMicActive &&
      isInternetGood &&
      speechTestCompleted &&
      isFullScreen &&
      isCameraActive &&
      photoTaken &&
      faceDetected
    ) {
      setOnSecurityPassed(true);
    } else setOnSecurityPassed(false);
  }, [
    isMicActive,
    isInternetGood,
    speechTestCompleted,
    onSecurityPassed,
    isFullScreen,
    isCameraActive,
    photoTaken,
    faceDetected,
  ]);

  const startProceedTest = () => {
    if (onSecurityPassed) {
      setProceedTest(true);
    } else {
      toast.error("Security measures not taken");
    }
  };

  return (
    <div className="security-container">
      <h1>Security Checks</h1>

      {error && (
        <div className="error-text">
          <p>{error}</p>
          <p>Please Allow all the permissions before conducting the test.</p>
        </div>
      )}
      <div className="security-body">
        <div className="status-tile-container">
          <p className="status-tile">
            <strong>Microphone:</strong>{" "}
            {isMicActive ? (
              <span style={{ color: "green" }}>Active</span>
            ) : (
              <span style={{ color: "red" }}>Inactive</span>
            )}
            <button
              className="secondary"
              onClick={initializeMic}
              disabled={isMicActive}
            >
              Check again
            </button>
          </p>
          <p className="status-tile">
            <strong>Internet Connection:</strong>{" "}
            {isInternetGood ? (
              <span style={{ color: "green" }}>Good</span>
            ) : (
              <span style={{ color: "red" }}>Weak/Slow</span>
            )}
            <button
              className="secondary"
              onClick={checkInternetConnection}
              disabled={isInternetGood}
            >
              Check again
            </button>
          </p>
          <p className="status-tile">
            <strong>Camera:</strong>{" "}
            {isCameraActive ? (
              photoTaken ? (
                <span style={{ color: "green" }}>Photo Captured</span>
              ) : (
                <span style={{ color: "orange" }}>Ready (Take Photo)</span>
              )
            ) : (
              <span style={{ color: "red" }}>Inactive</span>
            )}
            <button
              className="secondary"
              onClick={isCameraActive ? capturePhoto : initializeCamera}
              disabled={photoTaken}
            >
              {isCameraActive ? "Take Photo" : "Check again"}
            </button>
          </p>
          <p className="status-tile">
            <strong>FullScreen :</strong>{" "}
            {isFullScreen ? (
              <span style={{ color: "green" }}>Allowed</span>
            ) : (
              <span style={{ color: "red" }}>Not Allowed</span>
            )}
            <button
              className="secondary"
              onClick={checkFullScreen}
              disabled={isFullScreen}
            >
              Check again
            </button>
          </p>{" "}
          <p className="status-tile">
            <strong>Speech Test:</strong>{" "}
            {speechTestCompleted ? (
              <span style={{ color: "green" }}>Completed</span>
            ) : isSpeechTestActive ? (
              <span style={{ color: "orange" }}>Listening...</span>
            ) : (
              <span style={{ color: "red" }}>Not Completed</span>
            )}
            <button
              className="secondary"
              onClick={startSpeechTest}
              disabled={
                speechTestCompleted || isSpeechTestActive || !isMicActive
              }
            >
              {isSpeechTestActive ? "Listening..." : "Start Speech Test"}
            </button>
          </p>
          {/* Display the sentence to repeat */}
          {!speechTestCompleted && isMicActive && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Please say the following sentence clearly:</strong>
              </p>
              <p
                style={{
                  fontSize: "1.1em",
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                  margin: "0.5rem 0",
                }}
              >
                "{speechTestSentence}"
              </p>
              {transcribedText && (
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#666",
                    marginTop: "0.5rem",
                  }}
                >
                  <strong>You said:</strong> "{transcribedText}"
                </p>
              )}
            </div>
          )}
          {speechTestCompleted && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#e8f5e8",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "green", margin: 0 }}>
                ✓ Speech test completed successfully!
              </p>
              {transcribedText && (
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#666",
                    marginTop: "0.5rem",
                  }}
                >
                  <strong>Recognized:</strong> "{transcribedText}"
                </p>
              )}
            </div>
          )}
        </div>        <div className="video-preview" style={{ position: 'relative' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            style={{ 
              borderRadius: '8px',
              border: faceDetected ? '3px solid #22c55e' : '3px solid #ef4444'
            }}
          ></video>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: faceDetected ? '#22c55e' : '#ef4444',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {faceDetected ? '✓ Face OK' : '✗ Position Face'}
          </div>
        </div>
      </div>
      <button
        onClick={startProceedTest}
        className="primary"
        disabled={!onSecurityPassed}
      >
        Continue
      </button>
    </div>
  );
};

export default SecurityChecks;
