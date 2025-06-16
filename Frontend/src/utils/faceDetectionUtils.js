// Face detection utility functions
export const validateFaceDetection = (detection, videoElement) => {
  if (!detection || !videoElement) return false;
  
  const box = detection.box;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  
  // Calculate face area relative to video
  const faceArea = box.width * box.height;
  const videoArea = videoWidth * videoHeight;
  const faceRatio = faceArea / videoArea;
  
  // Face validation criteria
  const isReasonableSize = faceRatio > 0.01 && faceRatio < 0.8; // Between 1% and 80% of screen
  const hasMinimumDimensions = box.width > 50 && box.height > 50;
  const hasMaximumDimensions = box.width < videoWidth * 0.9 && box.height < videoHeight * 0.9;
  const isWellPositioned = box.x > -10 && box.y > -10; // Not cut off at edges
  const hasGoodAspectRatio = (box.width / box.height) > 0.5 && (box.width / box.height) < 2.5;
  
  return isReasonableSize && 
         hasMinimumDimensions && 
         hasMaximumDimensions && 
         isWellPositioned && 
         hasGoodAspectRatio;
};

export const getOptimalDetectionOptions = () => ({
  inputSize: 416,        // Higher resolution for better accuracy
  scoreThreshold: 0.5,   // Higher confidence threshold
});

export const filterValidDetections = (detections, videoElement) => {
  return detections.filter(detection => validateFaceDetection(detection, videoElement));
};

// Face position feedback
export const getFacePositionFeedback = (detection, videoElement) => {
  if (!detection || !videoElement) return "Position your face in front of the camera";
  
  const box = detection.box;
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const videoCenterX = videoWidth / 2;
  const videoCenterY = videoHeight / 2;
  
  const faceArea = box.width * box.height;
  const videoArea = videoWidth * videoHeight;
  const faceRatio = faceArea / videoArea;
  
  // Check if face is too small
  if (faceRatio < 0.02) {
    return "Move closer to the camera";
  }
  
  // Check if face is too large
  if (faceRatio > 0.6) {
    return "Move away from the camera";
  }
  
  // Check horizontal position
  if (centerX < videoCenterX * 0.7) {
    return "Move to the right";
  }
  
  if (centerX > videoCenterX * 1.3) {
    return "Move to the left";
  }
  
  // Check vertical position
  if (centerY < videoCenterY * 0.7) {
    return "Move down";
  }
  
  if (centerY > videoCenterY * 1.3) {
    return "Move up";
  }
  
  return "Perfect position!";
};
