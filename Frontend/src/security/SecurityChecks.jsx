import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import "./Security.css";

const SecurityChecks = () => {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [onSecurityPassed, setOnSecurityPassed] = useState(false);

  // States for the individual checks:
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioRecordingCompleted, setAudioRecordingCompleted] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isInternetGood, setIsInternetGood] = useState(false);
  const [error, setError] = useState(null);

  // Initialize media devices (camera & mic) and start audio recording sample
  const initializeMedia = async () => {
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Assign stream to video element for live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }

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
      console.error("Error accessing media devices:", err);
      setError("Error accessing camera/microphone: " + err.message);
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

  // Run the security checks on mount
  useEffect(() => {
    // initializeMedia();
    checkInternetConnection();

    // On unmount, stop all media tracks
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // When all checks pass, trigger the callback for further action (e.g., starting the test)
  useEffect(() => {
    if (
      isCameraActive &&
      isMicActive &&
      isInternetGood &&
      audioRecordingCompleted
    ) {
      setOnSecurityPassed(true);
    }
  }, [
    isCameraActive,
    isMicActive,
    isInternetGood,
    audioRecordingCompleted,
    recordedAudioUrl,
    onSecurityPassed,
  ]);

  return (
    <div className="security-container">
      <h1>Security Checks</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="security-body">
        <div className="status-tile-container">
          <p className="status-tile">
            <strong>Camera:</strong>{" "}
            {isCameraActive ? (
              <span style={{ color: "green" }}>Active</span>
            ) : (
              <span style={{ color: "red" }}>Inactive</span>
            )}
            <button className="secondary" onClick={initializeMedia} disabled={isCameraActive}>Check again</button>
          </p>
          <p className="status-tile">
            <strong>Microphone:</strong>{" "}
            {isMicActive ? (
              <span style={{ color: "green" }}>Active</span>
            ) : (
              <span style={{ color: "red" }}>Inactive</span>
            )}
            <button className="secondary" onClick={initializeMedia} disabled={isMicActive}>Check again</button>
          </p>
          <p className="status-tile">
            <strong>Internet Connection:</strong>{" "}
            {isInternetGood ? (
              <span style={{ color: "green" }}>Good</span>
            ) : (
              <span style={{ color: "red" }}>Weak/Slow</span>
            )}
            <button className="secondary" onClick={checkInternetConnection} disabled={isInternetGood}>Check again</button>
            </p>
          <p className="status-tile">
            <strong>Audio Sample:</strong>{" "}
            {audioRecordingCompleted ? (
              <span style={{ color: "green" }}>Recorded</span>
            ) : (
              <span style={{ color: "orange" }}>Recording...</span>
            )}
            <button className="secondary" onClick={() => startAudioRecording(mediaStreamRef.current)} disabled={audioRecordingCompleted}>Check again</button>
            </p>
        </div>

        <div className="video-preview">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          ></video>
        </div>

        {/* Optionally, provide an audio playback for review */}
        {recordedAudioUrl && (
          <div style={{ marginTop: "1rem" }}>
            <p className="status-tile">Review your recorded audio sample:</p>
            <audio controls src={recordedAudioUrl}></audio>
          </div>
        )}
      </div>
      <button className="primary" disabled={!onSecurityPassed} >Continue</button>
    </div>
  );
};

export default SecurityChecks;
