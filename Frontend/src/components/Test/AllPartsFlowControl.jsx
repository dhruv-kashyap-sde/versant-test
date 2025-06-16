import React, { useState } from "react";
import Disclaimer from "./Disclaimer";
import "../Parts.css";
import PartA from "../PartA";
import PartD from "../PartD";
import PartE from "../PartE";
import PartF from "../PartF";
import PartB from "../PartB";
import PartC from "../PartC";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AllPartsFlowControl = () => {
  const { student, partIndex, setPartIndex, handleContinue, setIsMicActive, 
    setAudioRecordingCompleted, setRecordedAudioUrl, setIsInternetGood, 
    setIsFullScreen, setOnSecurityPassed, mediaStreamRef } = useAuth();

  const navigate = useNavigate();
  const removeAllChecks = () => { 
    // Reset all security checks
    setIsMicActive(false);
    setAudioRecordingCompleted(false);
    setRecordedAudioUrl(null);
    setIsInternetGood(false);
    setIsFullScreen(false);
    setOnSecurityPassed(false);
    
    // Stop any active media streams
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  }

  return (
    <div>
      <div className="main-header">
        <h1 className="logo">SkillVedaa Swar</h1>
        <h2>{student.name}</h2>
      </div>
      {partIndex === -1 ? (
        <Disclaimer onContinue={handleContinue} />
      ) : partIndex === 0 ? (
        <PartA onContinue={handleContinue} />
      ) : partIndex === 1 ? (
        <PartB onContinue={handleContinue}/>
      ) : partIndex === 2 ? (
        <PartC onContinue={handleContinue}/>
      ) : partIndex === 3 ? (
        <PartD onContinue={handleContinue}/>
      ) : partIndex === 4 ? (
        <PartE onContinue={handleContinue}/>
      ) : partIndex === 5 ? (
        <PartF onContinue={handleContinue}/>
      ) : (
        <>
          {navigate("/")}
          {removeAllChecks()}
        </>
      )}
    </div>
  );
};

export default AllPartsFlowControl;
