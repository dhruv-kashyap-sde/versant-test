import axios from 'axios';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import A from './QuestionParts/A';
import B from './QuestionParts/B';
import { C } from './QuestionParts/C';
import { D } from './QuestionParts/D';
import { E } from './QuestionParts/E';
import { F } from './QuestionParts/F';

const CreateQuestions = () => {
    const [activeComponent, setActiveComponent] = useState("A");

    const renderComponent = () => {
        switch (activeComponent) {
            case "A":
                return <A />;
            case "B":
                return <B />;
            case "C":
                return <C />;
            case "D":
                return <D />;
            case "E":
                return <E />;
            case "F":
                return <F />;
            default:
                return <A />;
        }
    };

    return (
        <>
            <div className="header">
                <h1 className="color">Add Questions</h1>
            </div>
            <div className='hr'></div>
            <div className="question-container">
                <div className="parts-button">
                    <button className={`${activeComponent === "A" && 'active'} secondary`} onClick={() => setActiveComponent("A")}>Part A</button>
                    <button className={`${activeComponent === "B" && 'active'} secondary`} onClick={() => setActiveComponent("B")}>Part B</button>
                    <button className={`${activeComponent === "C" && 'active'} secondary`} onClick={() => setActiveComponent("C")}>Part C</button>
                    <button className={`${activeComponent === "D" && 'active'} secondary`} onClick={() => setActiveComponent("D")}>Part D</button>
                    <button className={`${activeComponent === "E" && 'active'} secondary`} onClick={() => setActiveComponent("E")}>Part E</button>
                    <button className={`${activeComponent === "F" && 'active'} secondary`} onClick={() => setActiveComponent("F")}>Part F</button>
                </div>
                <div className="hr"></div>
                <div className="question-body">
                    {renderComponent()}
                </div>
            </div>
        </>
    )
}

export default CreateQuestions;