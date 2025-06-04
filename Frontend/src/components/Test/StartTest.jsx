import React, { useContext, useEffect } from "react";
import SecurityChecks from "../../security/SecurityChecks";
import NotFullScreen from "../../security/NotFullScreen";
import AllPartsFlowControl from "./AllPartsFlowControl";
import { AuthContext } from "../../context/AuthContext";
import "./Disclaimer.css";
import FaceMonitor from "../../security/FaceMonitor";

const StartTest = () => {
  const { isFullScreen, checkFullScreen, proceedTest, setIsFullScreen, setFaceDetectionError } =
    useContext(AuthContext);

  useEffect(() => {
    setFaceDetectionError(null)
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [isFullScreen]);

  return (
    <>
      <div>
        {proceedTest ? <AllPartsFlowControl /> : <SecurityChecks />}
        {proceedTest && <div style={{position:'fixed', bottom: '10px', right:'10px', zIndex: 999}}>
          <FaceMonitor/>
          </div>}
        {!isFullScreen && <NotFullScreen checkFullScreen={checkFullScreen} />}
      </div>
    </>
  );
};

export default StartTest;
