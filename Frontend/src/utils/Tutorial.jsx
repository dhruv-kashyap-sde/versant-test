import React from "react";
import "./Tutorial.css";

const Tutorial = ({ head, see, type, click }) => {
  return (
    <>
      <div className="tutorial">
        <p>{head}</p>
        <div className="tut-box">
          <div className="box">
            <h3>Your question will be :</h3>
            <div style={{ background: "var(--text-2)" }} className="color">
              {see}
            </div>
          </div>
          <div className="box">
            <h3>Your answer will be :</h3>
            <div style={{ background: "var(--theme)" }} className="color">
              {type}
            </div>
          </div>
        </div>
        <button onClick={click} className="primary">
          Start
        </button>
      </div>
    </>
  );
};

export default Tutorial;
