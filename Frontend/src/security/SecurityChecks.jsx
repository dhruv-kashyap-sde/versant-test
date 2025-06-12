import axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
import "./Security.css";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import FaceMonitor from "./FaceMonitor";
import * as faceapi from "face-api.js";

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
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length === 0) {
          toast.error("No face detected");
          setFaceDetected(false);
        } else if (detections.length > 1) {
          toast.error("Multiple faces detected");
          setFaceDetected(false);
        } else {
          setFaceDetected(true);
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
        </div>

        <div className="video-preview">
          <video ref={videoRef} autoPlay muted playsInline></video>
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
