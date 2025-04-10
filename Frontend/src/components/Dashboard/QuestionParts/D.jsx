import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../utils/Loaders/Loader";

export const D = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [partQuestions, setPartQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=D`); // Adjust the API endpoint as needed
            // console.log("fetchQuestions", response.data);
            setPartQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            toast.error("Failed to fetch questions");
        }
    };

    const handleAddQuestion = async () => {
        if (!question.trim() || !answer.trim()) return;

        // Validate question contains underscore for blank space
        if (!question.includes('_')) {
            toast.error("Question must contain at least one underscore (_) for blank space");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/questions/partD`, { question, answer });
            toast.success("Question added successfully");
            setPartQuestions(response.data.questions);
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
            await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=D`); // Adjust the API endpoint as needed
            setPartQuestions(partQuestions.filter(q => q._id !== id));
            toast.success("Question deleted successfully");
        } catch (error) {
            console.error("Failed to delete question:", error);
            toast.error("Failed to delete question");
        }
    };

    return (
        <div>
            <h3>Part D: Candidates read a sentence with a missing word and write an appropriate word to complete the sentence.</h3>
            <div className="question-input">
                <form onSubmit={e => {e.preventDefault(); handleAddQuestion();}} className="a-form">
                <input
                required
                autoFocus
                    type="text"
                    placeholder="Enter the Question... "
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <input
                required
                    type="text"
                    placeholder='Enter the Answer...'
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <button
                    className="primary"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
                </form>
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
                        {partQuestions.map((q, index) => (
                            <tr key={q._id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
                                <td>{q.answer}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteQuestion(q._id)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {partQuestions.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No questions added yet or we are still loading them... <Loader/></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}