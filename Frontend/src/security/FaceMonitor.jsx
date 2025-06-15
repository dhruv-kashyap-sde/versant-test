// src/FaceMonitor.js
import React, { useContext, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { filterValidDetections, getOptimalDetectionOptions, getFacePositionFeedback } from "../utils/faceDetectionUtils";

function FaceMonitor() {
  const { testReport, setTestReport, 
    setIsFullScreen, setFaceDetectionError } = useContext(AuthContext);
  const videoRef = useRef(null);
  const [faceStatus, setFaceStatus] = useState("Initializing...");
  const detectionRef = useRef({
    consecutiveNoFaceCount: 0,
    consecutiveMultiFaceCount: 0,
    lastValidDetection: Date.now()
  });

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setFaceDetectionError("Camera access denied");
      }
    };

    loadModels().then(startVideo);

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
            
            // Provide helpful feedback
            if (detections.length > 0) {
              setFaceStatus(getFacePositionFeedback(detections[0], videoRef.current));
            } else {
              setFaceStatus("No face detected");
            }
            
            // Only trigger error after 3 consecutive failures (6 seconds)
            if (detectionRef.current.consecutiveNoFaceCount >= 3) {
              testReport.testLog.push(`No face detected at ${new Date().toLocaleString()}`);
              setTestReport({ ...testReport });
              setFaceDetectionError("No face detected, You will be redirected to the home page");
              setIsFullScreen(false);
              toast.error("No face detected - Please position yourself in front of the camera");
            }
          } else if (validDetections.length > 1) {
            detectionRef.current.consecutiveMultiFaceCount++;
            detectionRef.current.consecutiveNoFaceCount = 0;
            setFaceStatus("Multiple faces detected");
            
            // Only trigger error after 3 consecutive detections (6 seconds)
            if (detectionRef.current.consecutiveMultiFaceCount >= 3) {
              setFaceDetectionError("Multiple faces detected, You will be redirected to the home page");
              setIsFullScreen(false);
              toast.error("Multiple faces detected - Ensure only you are visible");
              testReport.testLog.push(`Multiple faces detected at ${new Date().toLocaleString()}`);
              setTestReport({ ...testReport });
            }
          } else {
            // Valid single face detected - reset counters
            detectionRef.current.consecutiveNoFaceCount = 0;
            detectionRef.current.consecutiveMultiFaceCount = 0;
            detectionRef.current.lastValidDetection = Date.now();
            setFaceStatus("Face detected ✓");
          }
        } catch (error) {
          console.error("Face detection error:", error);
          // Don't immediately fail on detection errors
        }
      }
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <video 
          style={{
            border: '5px solid var(--theme)',
            borderRadius: '8px',
            background: '#000'
          }} 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          width="200" 
        />        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: faceStatus.includes('✓') ? '#22c55e' : '#ef4444',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {faceStatus}
        </div>
      </div>
      <h4 style={{marginBottom:0, textAlign: 'center'}}>Live Video preview</h4>
    </>
  );
}

export default FaceMonitor;
