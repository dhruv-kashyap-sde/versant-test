import React, { useState, useEffect } from "react";
import "./Homepage.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Rules from "../../utils/Rules";

const Homepage = () => {
  const [tin, setTin] = useState("");
  const navigate = useNavigate();
  const { verifyTin, student, setStudent } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [hasSpeechSynthesisSupport, setHasSpeechSynthesisSupport] =
    useState(true);

  useEffect(() => {
    // Check for Speech Recognition support
    const hasSpeechRecognition =
      "SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window ||
      "mozSpeechRecognition" in window ||
      "msSpeechRecognition" in window;
    setHasSpeechSupport(hasSpeechRecognition);

    // Check for Speech Synthesis support
    const hasSpeechSynthesis = "speechSynthesis" in window;
    setHasSpeechSynthesisSupport(hasSpeechSynthesis);
  }, []);

  const handleTinChange = (e) => {
    setTin(e.target.value);
  };

  const validateTin = () => {
    setTin((tin) => tin.trim()); // Trim whitespace from TIN
    if (!/^\d{10}$/.test(tin)) {
      toast.error("TIN must be a 10-digit number");
      return false;
    }
    return true;
  };

  const [showRules, setShowRules] = useState(false);

  const checkTin = async () => {
    if (!validateTin()) return;

    // Check if browser supports required speech features
    if (!hasSpeechSupport || !hasSpeechSynthesisSupport) {
      toast.error(
        "Your browser does not support speech recognition or speech synthesis. Please use a different browser like Chrome."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/tin`,
        { tin },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setStudent(response.data.student);

      if (response.data.student.testStatus === "completed") {
        toast.error(
          "You have already completed the test. Please check your result."
        );
        navigate("/");
        return;
      }

      if (response.data.student.testStatus === "started") {
        toast.error(
          "You are not allowed to take the test. Please contact your instructor."
        );
        navigate("/");
        return;
      }

      if (response.status === 200) {
        toast.success("TIN verified");
        verifyTin(); // Set the verification state
        setShowRules(true);
        // navigate('/start-test'); // Navigate to the StartTest component
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "There was an error checking the TIN"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkResult = () => {
    if (!validateTin()) return;

    // navigate('/start-test');
    setResultLoading(true);
    axios
      .post(`${import.meta.env.VITE_API}/tin`, { tin })
      .then((response) => {
        // console.log(response.data);
        setStudent(response.data.student);
        setResultLoading(false);
        setShowResult(true);
      })
      .catch((error) => {
        // toast.error('There was an error checking the TIN');
        toast.error(`${error.response.data.message}`);
        // console.log('There was an error checking the TIN!', error);
        setLoading(false);
      });
  };

  const back = () => setShowResult(false);

  return (
    <>
      {showRules ? (
        <Rules inTest={true} back={back}/>
      ) : (
        <>
          <div className="homepage">
            <div className="content">
              <div className="content-header">
                <h1 className="title">Versant Test</h1>
                <div className="hr"></div>
              </div>
              <div className="content-body">
                <label htmlFor="tin">Start your test :</label>
                <input
                  id="tin-input"
                  type="number"
                  maxLength={10}
                  value={tin}
                  onChange={handleTinChange}
                  name="tin"
                  placeholder="Enter TIN here..."
                />
                <button onClick={checkTin} className="primary mr-10">
                  {loading ? "Checking..." : "Start Test"}
                </button>
                <button onClick={checkResult} className="secondary mr-10">
                  Result
                </button>
              </div>
              {(!hasSpeechSupport || !hasSpeechSynthesisSupport) && (
                <div className="speech-support-warning">
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    <i className="error"></i> Your browser does not support
                    speech recognition or speech synthesis features required for
                    this test. Please use a modern browser like{" "}
                    <strong>Chrome</strong> or <strong>Microsoft Edge</strong>.
                  </p>
                </div>
              )}
              <span style={{ fontSize: "12px", color: "#888" }}>
                Check Requirements and Guide <Link to="/rules">here</Link>
              </span>
            </div>
          </div>
          {showResult && (
            <div className="home-result-container">
              <div className="home-result-body">
                <h1 className="center">Test Result</h1>
                <p>
                  <strong>Test Status :</strong>{" "}
                  {student.testStatus === "completed" ? (
                    <span className="status-code">
                      <i className="ri-check-line green"> Completed</i>
                    </span>
                  ) : student.testStatus === "started" ? (
                    <span className="status-code">
                      <i className="ri-time-line color"> Started</i>{" "}
                    </span>
                  ) : (
                    <span className="status-code">
                      <i className="ri-close-line red"> Not Started</i>{" "}
                    </span>
                  )}
                </p>
                <p>
                  <span>Part A:</span> {student.testScore.partA} / 100
                </p>
                <p>
                  <span>Part B:</span> {student.testScore.partB} / 100
                </p>
                <p>
                  <span>Part C:</span> {student.testScore.partC} / 100
                </p>
                <p>
                  <span>Part D:</span> {student.testScore.partD} / 100
                </p>
                <p>
                  <span>Part E:</span> {student.testScore.partE} / 100
                </p>
                <p>
                  <span>Part F:</span> {student.testScore.partF} / 100
                </p>
                <div className="hr"></div>
                <p>
                  <strong>Total Score:</strong> {student.testScore.total}
                </p>
                <button
                  className="primary"
                  onClick={() => setShowResult(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Homepage;
