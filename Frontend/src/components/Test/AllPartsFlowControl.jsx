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
  const { student, partIndex, setPartIndex, handleContinue } = useAuth();

  const navigate = useNavigate();

  return (
    <div style={{height:"100vh", overflow:"hidden"}}>
      <div className="main-header">
        <h1 className="logo">Versant Test</h1>
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
        navigate("/")
      )}
    </div>
  );
};

export default AllPartsFlowControl;
