import React, { useState } from "react";
import Disclaimer from "./Disclaimer";
import "../Parts.css";
import PartA from "../PartA";
import PartD from "../PartD";

const AllPartsFlowControl = () => {
  const [partIndex, setPartIndex] = useState(-1);

  const handleContinue = () => {
    setPartIndex(i => i + 1);
  };

  return (
    <div style={{height:"100vh", overflow:"hidden"}}>
      <div className="main-header">
        <h1 className="logo">Versant Test</h1>
        <h2>Student name</h2>
      </div>
      {partIndex === -1 ? (
        <Disclaimer onContinue={handleContinue} />
      ) : (
        <PartD onContinue={handleContinue} />
      )}
    </div>
  );
};

export default AllPartsFlowControl;
