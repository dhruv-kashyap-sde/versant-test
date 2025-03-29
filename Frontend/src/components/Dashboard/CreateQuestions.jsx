import axios from 'axios';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import A from './QuestionParts/A';
import B from './QuestionParts/B';
import { C } from './QuestionParts/C';

const CreateQuestions = () => {
    const [activeComponent, setActiveComponent] = useState("C");

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
                                <td colSpan="4" style={{ textAlign: 'center' }}>No questions added yet or still loading</td>
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
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet or still loading</td>
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
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet or still loading</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}