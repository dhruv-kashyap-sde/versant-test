import React, { useState, useRef, useEffect } from 'react';

const SecurityChecks = ({ onSecurityPassed }) => {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

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
        setError('Microphone not detected.');
      }

      // Start recording an audio sample
      startAudioRecording(stream);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Error accessing camera/microphone: ' + err.message);
    }
  };

  // Record a 5-second audio sample using MediaRecorder
  const startAudioRecording = (stream) => {
    let chunks = [];
    try {
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudioUrl(audioUrl);
        setAudioRecordingCompleted(true);
      };

      recorder.start();
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5000);
    } catch (err) {
      console.error('Audio recording error:', err);
      setError('Audio recording error: ' + err.message);
    }
  };

  // Check internet connection performance
  const checkInternetConnection = async () => {
    try {
      const startTime = Date.now();
      // Fetch a lightweight resource; adjust URL as needed (e.g., your server's favicon)
      const response = await fetch('/favicon.ico', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Resource unavailable');
      }
      const elapsed = Date.now() - startTime;
      // Set a threshold of 300ms for a "good" connection (adjust as needed)
      setIsInternetGood(elapsed < 300);
    } catch (err) {
      console.error('Internet connection check failed:', err);
      setIsInternetGood(false);
    }
  };

  // Run the security checks on mount
  useEffect(() => {
    initializeMedia();
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
      onSecurityPassed && onSecurityPassed({ audioSampleUrl: recordedAudioUrl });
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
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Security Checks</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <video
          ref={videoRef}
          width="320"
          height="240"
          autoPlay
          muted
          playsInline
          style={{ border: '1px solid #000', marginBottom: '1rem' }}
        ></video>
      </div>

      <div>
        <p>
          <strong>Camera:</strong>{' '}
          {isCameraActive ? (
            <span style={{ color: 'green' }}>Active</span>
          ) : (
            <span style={{ color: 'red' }}>Inactive</span>
          )}
        </p>
        <p>
          <strong>Microphone:</strong>{' '}
          {isMicActive ? (
            <span style={{ color: 'green' }}>Active</span>
          ) : (
            <span style={{ color: 'red' }}>Inactive</span>
          )}
        </p>
        <p>
          <strong>Internet Connection:</strong>{' '}
          {isInternetGood ? (
            <span style={{ color: 'green' }}>Good</span>
          ) : (
            <span style={{ color: 'red' }}>Weak/Slow</span>
          )}
        </p>
        <p>
          <strong>Audio Sample:</strong>{' '}
          {audioRecordingCompleted ? (
            <span style={{ color: 'green' }}>Recorded</span>
          ) : (
            <span style={{ color: 'orange' }}>Recording...</span>
          )}
        </p>
      </div>

      {/* Optionally, provide an audio playback for review */}
      {recordedAudioUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>Review your recorded audio sample:</p>
          <audio controls src={recordedAudioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default SecurityChecks;
