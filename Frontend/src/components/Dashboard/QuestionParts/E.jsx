import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const E = () => {
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [partQuestions, setPartQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=E`); // Adjust the API endpoint as needed
            // console.log("fetchQuestions", response.data.questions);
            setPartQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            toast.error("Failed to fetch questions");
        }
    };

    const handleAddQuestion = async () => {
        if (!question.trim()) return;

        setLoading(true);
        try {
            let response = await axios.post(`${import.meta.env.VITE_API}/questions/partE`, { question });
            toast.success("Question added successfully");
            setPartQuestions(response.data.questions);
            setQuestion('');
        } catch (error) {
            console.error("Failed to add question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=E`); // Adjust the API endpoint as needed
            setPartQuestions(partQuestions.filter(q => q._id !== id));
            toast.success("Question deleted successfully");
        } catch (error) {
            console.error("Failed to delete question:", error);
            toast.error("Failed to delete question");
        }
    };
    return (
        <div>
            <h3>Part E: Candidates hear a sentence and must type the sentence exactly as they hear it</h3>
            <div className="question-input">
                <form onSubmit={e => {e.preventDefault(); handleAddQuestion();}} className="a-form">
                <input
                    type="text"
                    placeholder='Enter the Question...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button
                    className="primary"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
                </form>
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
                        {partQuestions.map((q, index) => (
                            <tr key={q._id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
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
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet or we are still loading them...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}