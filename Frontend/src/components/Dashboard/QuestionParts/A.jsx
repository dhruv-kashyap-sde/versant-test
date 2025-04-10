import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../utils/Loaders/Loader";

const A = () => {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [partQuestions, setPartQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=A`); // Adjust the API endpoint as needed
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
            const newQuestion = { question };
            const response = await axios.post(`${import.meta.env.VITE_API}/questions/partA`, newQuestion); // Adjust the API endpoint as needed
            setPartQuestions(response.data.questions)
            setQuestion('');
            toast.success("Question added successfully");
        } catch (error) {
            console.error("Failed to add question:", error);
            toast.error("Failed to add question");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=A`); // Adjust the API endpoint as needed
            setPartQuestions(partQuestions.filter(q => q._id !== id));
            toast.success("Question deleted successfully");
        } catch (error) {
            console.error("Failed to delete question:", error);
            toast.error("Failed to delete question");
        }
    };

    return (
        <div>
            <h3>Part A: Candidates are asked to repeat sentences that they hear</h3>
            <div className="question-input">
                <form className='a-form' onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }}>
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
                <h3><strong>Example </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-speak-line"></i> : "With all the good programs available it's difficult to make a quick decision."</p>
                <p><i className="ri-mic-line"></i> : "With all the good programs available it's difficult to make a quick decision."</p>
            </div>
            <div>
                <table className=' example-box'>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Question</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partQuestions.length > 0 ? (
                            partQuestions.map((q, index) => (
                                <tr key={q._id}>
                                    <td>{index + 1}</td>
                                    <td>{q.question}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteQuestion(q._id)}
                                            disabled={loading}
                                        >
                                            <i className="ri-delete-bin-6-line"></i> {loading ? 'loading...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>No questions added yet or we are still loading them... <Loader/></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default A;