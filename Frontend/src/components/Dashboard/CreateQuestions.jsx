import React, { useState, useEffect } from 'react'

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

export const A = () => {
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setQuestions([
                { id: 1, question: "With all the good programs available it's difficult to make a quick decision." }
            ]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!question.trim()) return;
        
        setLoading(true);
        try {
            const newQuestion = { id: Date.now(), question };
            setQuestions([...questions, newQuestion]);
            setQuestion('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            <h3>Part A: Candidates are asked to repeat sentences that they hear</h3>
            <div className="question-input">
                <input 
                    type="text" 
                    placeholder='Enter the Question...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button 
                    className="primary" 
                    onClick={handleAddQuestion}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
            <div className="example-box">
                <h3><strong>Example </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-speak-line"></i> : "With all the good programs available it's difficult to make a quick decision."</p>
                <p><i className="ri-mic-line"></i> : "With all the good programs available it's difficult to make a quick decision."</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Question</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const B = () => {
    const [phrase1, setPhrase1] = useState('');
    const [phrase2, setPhrase2] = useState('');
    const [phrase3, setPhrase3] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setQuestions([
                { id: 1, phrase1: "Left immediately", phrase2: "after the meeting ended", phrase3: "the sales man" }
            ]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!phrase1.trim() || !phrase2.trim() || !phrase3.trim()) return;
        
        setLoading(true);
        try {
            const newQuestion = { id: Date.now(), phrase1, phrase2, phrase3 };
            setQuestions([...questions, newQuestion]);
            setPhrase1('');
            setPhrase2('');
            setPhrase3('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            <h3>Part B: Candidates hear three short phrases and are asked to rearrange them to make a sentence</h3>
            <div className="question-input">
                <input 
                    type="text" 
                    placeholder='Enter the Phrase 1...'
                    value={phrase1}
                    onChange={(e) => setPhrase1(e.target.value)}
                />...
                <input 
                    type="text" 
                    placeholder='Enter the Phrase 2...'
                    value={phrase2}
                    onChange={(e) => setPhrase2(e.target.value)}
                />...
                <input 
                    type="text" 
                    placeholder='Enter the Phrase 3...'
                    value={phrase3}
                    onChange={(e) => setPhrase3(e.target.value)}
                />
                <button 
                    className="primary" 
                    onClick={handleAddQuestion}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-speak-line"></i> : Left immediately... after the meeting ended... the sales man.</p>
                <p><i className="ri-mic-line"></i> : The salesman left immediately after the meeting ended.</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Phrase 1</th>
                            <th>Phrase 2</th>
                            <th>Phrase 3</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.phrase1}</td>
                                <td>{q.phrase2}</td>
                                <td>{q.phrase3}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No questions added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const C = () => {
    const [dialog1, setDialog1] = useState('');
    const [dialog2, setDialog2] = useState('');
    const [dialog3, setDialog3] = useState('');
    const [question, setQuestion] = useState('');
    const [keywords, setKeywords] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setQuestions([
                { 
                    id: 1, 
                    dialog1: "Lucy, can you come to the office early tomorrow?", 
                    dialog2: "Sure, what time?", 
                    dialog3: "7:30 would be great.",
                    question: "What will Lucy have to do tomorrow morning?",
                    keywords: "Go to the office early, She will go to the office at 7:30"
                }
            ]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!dialog1.trim() || !dialog2.trim() || !dialog3.trim() || !question.trim() || !keywords.trim()) return;
        
        setLoading(true);
        try {
            const newQuestion = { id: Date.now(), dialog1, dialog2, dialog3, question, keywords };
            setQuestions([...questions, newQuestion]);
            setDialog1('');
            setDialog2('');
            setDialog3('');
            setQuestion('');
            setKeywords('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            <h3>Part C: Candidates listen to a conversation between two speakers and answer a comprehension question with a word or short phrase</h3>
            <div className="question-input">
                <input 
                    type="text" 
                    placeholder='Enter the Dialog of speaker 1...'
                    value={dialog1}
                    onChange={(e) => setDialog1(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder='Enter the Dialog of speaker 2...'
                    value={dialog2}
                    onChange={(e) => setDialog2(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder='Enter the Dialog of speaker 1...'
                    value={dialog3}
                    onChange={(e) => setDialog3(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder='Enter the Question...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder='Enter the keywords...'
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                />
                <button 
                    className="primary" 
                    onClick={handleAddQuestion}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-speak-line"></i> : <strong>Speaker 1</strong>: Lucy, can you come to the office early tomorrow?</p>
                <p><i className="ri-speak-line"></i> : <strong>Speaker 2</strong>: Sure, what time?</p>
                <p><i className="ri-speak-line"></i> : <strong>Speaker 1</strong>: 7:30 would be great.</p>
                <br />
                <p><i className="ri-speak-line"></i> : <strong>Question</strong>: What will Lucy have to do tomorrow morning?.</p>
                <p><i className="ri-mic-line"></i> : <strong>Answer</strong>: "Go to the office early." or "She will go to the office at 7:30"</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Dialog 1</th>
                            <th>Dialog 2</th>
                            <th>Dialog 3</th>
                            <th>Question</th>
                            <th>Keywords</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.dialog1}</td>
                                <td>{q.dialog2}</td>
                                <td>{q.dialog3}</td>
                                <td>{q.question}</td>
                                <td>{q.keywords}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No questions added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const D = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setQuestions([
                { id: 1, question: "It's ____ tonight. Bring your sweater.", answer: "cold" }
            ]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!question.trim() || !answer.trim()) return;
        
        setLoading(true);
        try {
            const newQuestion = { id: Date.now(), question, answer };
            setQuestions([...questions, newQuestion]);
            setQuestion('');
            setAnswer('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            <h3>Part D: Candidates read a sentence with a missing word and write an appropriate word to complete the sentence.</h3>
            <div className="question-input">
                <input 
                    type="text" 
                    placeholder="Enter the Question... "
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder='Enter the Answer...'
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <button 
                    className="primary" 
                    onClick={handleAddQuestion}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
            <p className="secondary-text">**tip - use underscore ( ____ ) for blank spaces</p>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-eye-line"></i> : It's ___ tonight. Bring your sweater.</p>
                <p><i className="ri-pencil-line"></i> : Cold</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
                                <td>{q.answer}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No questions added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const E = () => {
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setQuestions([
                { id: 1, question: "Can you work on Monday? Yes I can." }
            ]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!question.trim()) return;
        
        setLoading(true);
        try {
            const newQuestion = { id: Date.now(), question };
            setQuestions([...questions, newQuestion]);
            setQuestion('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            <h3>Part E: Candidates hear a sentence and must type the sentence exactly as they hear it</h3>
            <div className="question-input">
                <input 
                    type="text" 
                    placeholder='Enter the Question...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button 
                    className="primary" 
                    onClick={handleAddQuestion}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-speak-line"></i> : Can you work on Monday? Yes I can.</p>
                <p><i className="ri-pencil-line"></i> : Can you work on Monday? Yes I can.</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Question</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const F = () => {
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setQuestions([
                { id: 1, question: "Mic went to 10 job interviews. At the last interview, he finally received a job offer." }
            ]);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!question.trim()) return;
        
        setLoading(true);
        try {
            const newQuestion = { id: Date.now(), question };
            setQuestions([...questions, newQuestion]);
            setQuestion('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            <h3>Part F: Candidates reconstruct the content of a short passage presented for 30 seconds</h3>
            <div className="question-input">
                <input 
                    type="text" 
                    placeholder='Enter the Question...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button 
                    className="primary" 
                    onClick={handleAddQuestion}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-eye-line"></i> : Mic went to 10 job interviews. At the last interview, he finally received a job offer.</p>
                <p><i className="ri-pencil-line"></i> : Mic had 10 job interviews. He got an offer after the final interview.</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Question</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}