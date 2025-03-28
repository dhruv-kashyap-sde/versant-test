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
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
            <div className="example-box">
                <h3><strong>Example </strong></h3>
                <div className="hr"></div>
                <p><i class="ri-speak-line"></i> : "With all the good programs available it’s difficult to make a quick decision."</p>
                <p><i class="ri-mic-line"></i> : "With all the good programs available it’s difficult to make a quick decision."</p>
            </div>
        </div>
    )
}

export const B = () => {
    return (
        <div>
            <h3>Part B: Candidates hear three short phrases and are asked to rearrange them to make a sentence</h3>
            <div className="question-input">
                <input type="text" placeholder='Enter the Phrase 1...'/>...
                <input type="text" placeholder='Enter the Phrase 2...'/>...
                <input type="text" placeholder='Enter the Phrase 3...'/>
                <button className="primary">Add </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i class="ri-speak-line"></i> : Left immediately... after the meeting ended... the sales man.</p>
                <p><i class="ri-mic-line"></i> : The salesman left immediately after the meeting ended.</p>
            </div>
        </div>
    )
}

export const C = () => {
    return (
        <div>
            <h3>Part C: Candidates listen to a conversation between two speakers and answer a comprehension question with a word or short phrase</h3>
            <div className="question-input">
                <input type="text" placeholder='Enter the Dialog of speaker 1...'/>
                <input type="text" placeholder='Enter the Dialog of speaker 2...'/>
                <input type="text" placeholder='Enter the Dialog of speaker 1...'/>
                <input type="text" placeholder='Enter the Question...'/>
                <input type="text" placeholder='Enter the keywords...'/>
                <button className="primary">Add </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i class="ri-speak-line"></i> : <strong>Speaker 1</strong>: Lucy, can you come to the office early tomorrow?</p>
                <p><i class="ri-speak-line"></i> : <strong>Speaker 2</strong>: Sure, what time?</p>
                <p><i class="ri-speak-line"></i> : <strong>Speaker 1</strong>: 7:30 would be great.</p>
                <br />
                <p><i class="ri-speak-line"></i> : <strong>Question</strong>: What will Lucy have to do tomorrow morning?.</p>
                <p><i class="ri-mic-line"></i> : <strong>Answer</strong>: "Go to the office early." or "She will go to the office at 7:30"</p>
            </div>
        </div>
    )
}

export const D = () => {
    return (
        <div>
            <h3>Part D: Candidates read a sentence with a missing word and write an appropriate word to complete the sentence.</h3>
            <div className="question-input">
                <input type="text" placeholder="Enter the Question... "/>
                <input type="text" placeholder='Enter the Answer...'/>
                <button className="primary">Add </button>
            </div>
            <p className="secondary-text">**tip - use underscore ( ____ ) for blank spaces</p>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i class="ri-eye-line"></i> : It's ___ tonight. Bring your sweater.</p>
                <p><i class="ri-pencil-line"></i> : Cold</p>
            </div>
        </div>
    )
}

export const E = () => {
    return (
        <div>
            <h3>Part E: Candidates hear a sentence and must type the sentence exactly as they hear it</h3>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i class="ri-speak-line"></i> : Can you work on Monday? Yes I can.</p>
                <p><i class="ri-pencil-line"></i> : Can you work on Monday? Yes I can.</p>
            </div>
        </div>
    )
}

export const F = () => {
    return (
        <div>
            <h3>Part F: Candidates reconstruct the content of a short passage presented for 30 seconds</h3>
            <div className="question-input">
                <input type="text" placeholder='Enter the Question...'/>
                <button className="primary">Add </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i class="ri-eye-line"></i> : Mic went to 10 job interviews. At the last interview, he finally received a job offer.</p>
                <p><i class="ri-pencil-line"></i> : Mic had 10 job interviews. He got an offer after the final interview.</p>
            </div>
        </div>
    )
}