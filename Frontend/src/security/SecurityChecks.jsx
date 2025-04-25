import axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
import "./Security.css";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const SecurityChecks = () => {

  const {
    videoRef, mediaStreamRef,
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
    setIsFullScreen,
    checkFullScreen,
    handleFullScreenChange,
    proceedTest,
    setProceedTest, checkInternetConnection, initializeMic
  } = useContext(AuthContext);

  // Run the security checks on mount
  useEffect(() => {
    initializeMic();
    checkInternetConnection();
    checkFullScreen();

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // On unmount, stop all media tracks and remove event listener
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // When all checks pass, trigger the callback for further action (e.g., starting the test)
  useEffect(() => {
    if (
      isMicActive &&
      isInternetGood &&
      audioRecordingCompleted &&
      isFullScreen
    ) {
      setOnSecurityPassed(true);
    }
  }, [
    isMicActive,
    isInternetGood,
    audioRecordingCompleted,
    recordedAudioUrl,
    onSecurityPassed,
    isFullScreen,
  ]);

  const startProceedTest = () => {
    if (onSecurityPassed) {
      setProceedTest(true);
    } else{
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
