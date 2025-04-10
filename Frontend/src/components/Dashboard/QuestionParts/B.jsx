import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../utils/Loaders/Loader";

const B = () => {
    const [phrase1, setPhrase1] = useState('');
    const [phrase2, setPhrase2] = useState('');
    const [phrase3, setPhrase3] = useState('');
    const [rearranged, setRearranged] = useState('');
    const [loading, setLoading] = useState(false);

    // for the generated question
    const [partQuestions, setPartQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=B`); // Adjust the API endpoint as needed
            // console.log("fetchQuestions", response.data);
            setPartQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            toast.error("Failed to fetch questions");
        }
    };

    const handleAddQuestion = async () => {
        try {
            setLoading(true);
            // Create the concatenated question string with "..." between phrases
            const questionText = `${phrase1}... ${phrase2}... ${phrase3}`;
            
            // Send the question to the backend
            const response = await axios.post(`${import.meta.env.VITE_API}/questions/partB`, {
                question: questionText,
                rearranged: rearranged,
                // Include any other required fields
            });
            setPartQuestions(response.data.questions); // Update the state with the new question
            
            // Reset form fields
            setPhrase1('');
            setPhrase2('');
            setPhrase3('');
            setRearranged('');
            
            toast.success("Question added successfully!");
        } catch (error) {
            console.error("Failed to add question:", error);
            toast.error("Failed to add question");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=B`); // Adjust the API endpoint as needed
            setPartQuestions(partQuestions.filter(q => q._id !== id));
            toast.success("Question deleted successfully");
        } catch (error) {
            console.error("Failed to delete question:", error);
            toast.error("Failed to delete question");
        }
    };

    return (
        <div>
            <h3>Part B: Candidates hear three short phrases and are asked to rearrange them to make a sentence</h3>
            <div className="question-input">
                <form className='b-form' onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }}>
                    <div className="line-1">
                        <input
                            required
                            autoFocus
                            type="text"
                            placeholder='Enter the Phrase 1...'
                            value={phrase1}
                            onChange={(e) => setPhrase1(e.target.value)}
                        />...
                        <input
                            required
                            type="text"
                            placeholder='Enter the Phrase 2...'
                            value={phrase2}
                            onChange={(e) => setPhrase2(e.target.value)}
                        />...
                        <input
                            required
                            type="text"
                            placeholder='Enter the Phrase 3...'
                            value={phrase3}
                            onChange={(e) => setPhrase3(e.target.value)}
                        />
                    </div>
                    <div className="line-2">
                        <input
                            required
                            type="text"
                            placeholder='Enter the rearranged sentence...'
                            value={rearranged}
                            onChange={(e) => setRearranged(e.target.value)}
                        />
                        
                        <button
                            className="primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
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
                            <th>Phrases</th>
                            <th>Rearranged</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partQuestions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.question}</td>
                                <td>{q.rearranged}</td>
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
                                <td colSpan="5" style={{ textAlign: 'center' }}>No questions added yet or we are still loading them... <Loader/></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default B;