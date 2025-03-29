import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const C = () => {
    const [dialog1, setDialog1] = useState('');
    const [dialog2, setDialog2] = useState('');
    const [dialog3, setDialog3] = useState('');
    const [question, setQuestion] = useState('');
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);

    const [partQuestions, setPartQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=C`); // Adjust the API endpoint as needed
            console.log("fetchQuestions", response.data);
            setPartQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            toast.error("Failed to fetch questions");
        }
    };

    const handleAddQuestion = async () => {
        // Validate inputs
        if (!dialog1 || !dialog2 || !dialog3 || !question || !keywords) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);
        try {
            // Create dialog array according to the schema
            const dialogArray = [
                { speaker: "Speaker 1", text: dialog1 },
                { speaker: "Speaker 2", text: dialog2 },
                { speaker: "Speaker 1", text: dialog3 }
            ];

            // Split keywords by comma and trim whitespace
            const keywordsArray = keywords.split(',').map(keyword => keyword.trim());

            const validQuestion = {
                dialog: dialogArray,
                question: question,
                keywords: keywordsArray
            }

            const response = await axios.post(`${import.meta.env.VITE_API}/questions/add`, validQuestion);

            toast.success("Question added successfully");
            // Reset form fields
            setDialog1('');
            setDialog2('');
            setDialog3('');
            setQuestion('');
            setKeywords('');
            // Refresh questions list
            setPartQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to add question:", error);
            toast.error(error.response?.data?.message || "Failed to add question");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=C`); // Adjust the API endpoint as needed
            setPartQuestions(partQuestions.filter(q => q._id !== id));
            toast.success("Question deleted successfully");
        } catch (error) {
            console.error("Failed to delete question:", error);
            toast.error("Failed to delete question");
        }
    };

    return (
        <div>
            <h3>Part C: Candidates listen to a conversation between two speakers and answer a comprehension question with a word or short phrase</h3>
            <div className="question-input">
                <form onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }} className="c-form">
                    <div className="line-1">
                        <input
                            required
                            type="text"
                            placeholder='Enter the Dialog of speaker 1...'
                            value={dialog1}
                            onChange={(e) => setDialog1(e.target.value)}
                        />
                        <input
                            required
                            type="text"
                            placeholder='Enter the Dialog of speaker 2...'
                            value={dialog2}
                            onChange={(e) => setDialog2(e.target.value)}
                        />
                        <input
                            required
                            type="text"
                            placeholder='Enter the Dialog of speaker 1...'
                            value={dialog3}
                            onChange={(e) => setDialog3(e.target.value)}
                        />
                    </div>
                    <div className="line-2">
                        <input
                            required
                            type="text"
                            placeholder='Enter the Question...'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <input
                            required
                            type="text"
                            placeholder='Enter the important keywords...'
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
                </form>
            </div>
            <div className="example-box">
                <h3><strong>Example : </strong></h3>
                <div className="hr"></div>
                <p><i className="ri-speak-line"></i> : <strong>Speaker 1</strong>: Lucy, can you come to the office early tomorrow?</p>
                <p><i className="ri-speak-line"></i> : <strong>Speaker 2</strong>: Sure, what time?</p>
                <p><i className="ri-speak-line"></i> : <strong>Speaker 1</strong>: 7:30 would be great.</p>
                <br />
                <p><i className="ri-speak-line"></i> : <strong>Question</strong>: What will Lucy have to do tomorrow morning? <strong>Keywords: </strong>Office, early. morning</p>
                <p><i className="ri-mic-line"></i> : <strong>Answer</strong>: "Go to the office early." or "She will go to the office at 7:30"</p>
            </div>
            <div className="questions-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Speaker 1</th>
                            <th>Speaker 2</th>
                            <th>Speaker 1</th>
                            <th>Question</th>
                            <th>Keywords</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partQuestions.map((q, index) => (
                            <tr key={q.id}>
                                <td>{index + 1}</td>
                                <td>{q.dialog[0].text}</td>
                                <td>{q.dialog[1].text}</td>
                                <td>{q.dialog[2].text}</td>
                                <td>{q.question}</td>
                                <td>{q.keywords}</td>
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
                                <td colSpan="7" style={{ textAlign: 'center' }}>No questions added yet or still loading</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

