import React, { useState } from "react";
import Disclaimer from "./Disclaimer";
import "../Parts.css";
import PartA from "../PartA";
import PartD from "../PartD";
import PartE from "../PartE";
import PartF from "../PartF";
import PartB from "../PartB";
import PartC from "../PartC";

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
        <div>Test completed!</div>
      )}
    </div>
  );
};

export default AllPartsFlowControl;
