// src/FaceMonitor.js
import React, { useContext, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function FaceMonitor() {
  const { testReport, setTestReport, 
    setIsFullScreen, setFaceDetectionError } = useContext(AuthContext);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    loadModels().then(startVideo);

    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length === 0) {
          testReport.testLog.push(`No face detected at ${new Date().toLocaleString()}`);
          setTestReport({ ...testReport });
          setFaceDetectionError("No face detected, You will be redirected to the home page");
          setIsFullScreen(false);
          toast.error("No face detected");
        } else if (detections.length > 1) {
          setFaceDetectionError("Multiple face detected, You will be redirected to the home page");
          setIsFullScreen(false);
          toast.error("Multiple faces detected");
          testReport.testLog.push(`Multiple faces detected at ${new Date().toLocaleString()}`);
          setTestReport({ ...testReport });
        } 
      }
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <video style={{border: '5px solid var(--theme  )'}} ref={videoRef} autoPlay muted width="200" />
      <h4 style={{marginBottom:0, textAlign: 'center'}}>Live Video preview</h4>
    </>
  );
}

export default FaceMonitor;
