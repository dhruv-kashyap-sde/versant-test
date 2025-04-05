import React, { useContext, useEffect } from "react";
import SecurityChecks from "../../security/SecurityChecks";
import NotFullScreen from "../../security/NotFullScreen";
import AllPartsFlowControl from "./AllPartsFlowControl";
import { AuthContext } from "../../context/AuthContext";
import './Disclaimer.css';

const StartTest = () => {
  const {
    isFullScreen,
    checkFullScreen,
    proceedTest,
    setIsFullScreen
  } = useContext(AuthContext);

  useEffect(() => {
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
    <div>

      {proceedTest ? (
        <AllPartsFlowControl />
      ) : (
        <SecurityChecks />
      )}
      {!isFullScreen &&
        <NotFullScreen checkFullScreen={checkFullScreen} />
      }
    </div>
  );
};

export default StartTest;
