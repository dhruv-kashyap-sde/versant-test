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
        } else{
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
      audioRecordingCompleted &&
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
    audioRecordingCompleted,
    recordedAudioUrl,
    onSecurityPassed,
    isFullScreen,
    isCameraActive,
    photoTaken,
    faceDetected
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
          </p>
          {/* Disabled because no use right now */}
          {/* <p className="status-tile">
            <strong>Audio Sample:</strong>{" "}
            {audioRecordingCompleted ? (
              <span style={{ color: "green" }}>Recorded</span>
            ) : (
              <span style={{ color: "orange" }}>Recording...</span>
            )}
            <button
              className="secondary"
              onClick={() => startAudioRecording(mediaStreamRef.current)}
              disabled={audioRecordingCompleted}
            >
              Check again
            </button>
          </p>
        {recordedAudioUrl && (
          <div style={{ marginTop: "1rem" }}>
            <p className="status-tile">Review your recorded audio sample:</p>
            <audio controls src={recordedAudioUrl}></audio>
          </div>
        )} */}
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
