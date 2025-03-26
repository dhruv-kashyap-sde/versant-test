import React, { useState } from 'react'

const CreateQuestions = () => {
    const [activeComponent, setActiveComponent] = useState("A");

    // const navigate = useNavigate();

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

export const A = () => {
    return (
        <div>
            <h3>Part A: Candidates are asked to repeat sentences that they hear</h3>
            <p><strong>Example : </strong>With all the good programs available it’s difficult to make a quick decision.</p>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
        </div>
    )
}

export const B = () => {
    return (
        <div>
            <h3>Part B: Candidates hear three short phrases and are asked to rearrange them to make a sentence</h3>
            <p><strong>Example : </strong>With all the good programs available it’s difficult to make a quick decision.</p>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
        </div>
    )
}

export const C = () => {
    return (
        <div>
            <h3>Part C: Candidates listen to a conversation between two speakers and answer a comprehension question with a word or short phrase</h3>
            <p><strong>Example : </strong>With all the good programs available it’s difficult to make a quick decision.</p>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
        </div>
    )
}

export const D = () => {
    return (
        <div>
            <h3>Part D: Candidates read a sentence with a missing word and supply an appropriate word to complete the sentence</h3>
            <p><strong>Example : </strong>With all the good programs available it’s difficult to make a quick decision.</p>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
        </div>
    )
}

export const E = () => {
    return (
        <div>
            <h3>Part E: Candidates hear a sentence and must type the sentence exactly as they hear it</h3>
            <p><strong>Example : </strong>With all the good programs available it’s difficult to make a quick decision.</p>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
        </div>
    )
}

export const F = () => {
    return (
        <div>
            <h3>Part F: Candidates reconstruct the content of a short passage presented for 30 seconds</h3>
            <p><strong>Example : </strong>With all the good programs available it’s difficult to make a quick decision.</p>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
        </div>
    )
}