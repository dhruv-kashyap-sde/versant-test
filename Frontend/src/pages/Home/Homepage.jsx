import React, { useState } from "react";
import "./Homepage.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Homepage = () => {
  const [tin, setTin] = useState('');
  const navigate = useNavigate();
  const { verifyTin, student, setStudent } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTinChange = (e) => {
    setTin(e.target.value);
  };

  const validateTin = () => {
    setTin(tin => tin.trim()); // Trim whitespace from TIN
    if (!/^\d{10}$/.test(tin)) {
      toast.error('TIN must be a 10-digit number');
      return false;
    }
    return true;
  };

  const checkTin = () => {
    if (!validateTin()) return;

    // navigate('/start-test');
    setLoading(true);
    axios.post(`${import.meta.env.VITE_API}/tin`, { tin })
      .then(response => {
        console.log(response.data);
        setStudent(response.data.student);

        if (response.data.student.testStatus === "completed") {
          toast.error("You have already completed the test. Please check your result.");
          navigate("/");
          setLoading(false);
          return;
        }

        if (response.data.student.testStatus === "started") {
          toast.error("You are not allowed to take the test. Please contact your instructor.");
          navigate("/");
          setLoading(false);
          return;
        }

        if (response.status === 200) {
          toast.success('TIN verified');
          verifyTin(); // Set the verification state
          navigate('/start-test'); // Navigate to the StartTest component
        }
        setLoading(false);
      })
      .catch(error => {
        // toast.error('There was an error checking the TIN');
        toast.error(`${error.response.data.message}`);
        console.log('There was an error checking the TIN!', error);
        setLoading(false);
      });
  };

  const checkResult = () => {
    if (!validateTin()) return;

    // navigate('/start-test');
    setResultLoading(true);
    axios.post(`${import.meta.env.VITE_API}/tin`, { tin })
      .then(response => {
        console.log(response.data);
        setStudent(response.data.student);
        setResultLoading(false);
        setShowResult(true);
      })
      .catch(error => {
        // toast.error('There was an error checking the TIN');
        toast.error(`${error.response.data.message}`);
        console.log('There was an error checking the TIN!', error);
        setLoading(false);
      });
  }

  return (
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
            <button onClick={checkResult} className="secondary mr-10">Result</button>
          </div>
        </div>
      </div>
      {showResult && (
        <div className="home-result-container">
          <div className="home-result-body">
          <h1 className="center">Test Result</h1>
          <p><strong>Test Status :</strong> {student.testStatus === "completed" ? (
                  <span className='status-code'><i className="ri-check-line green"> Completed</i></span>
                ) : student.testStatus === "started" ? (
                  <span className='status-code'><i className="ri-time-line color"> Started</i> </span>
                ) : (
                  <span className='status-code'><i className="ri-close-line red"> Not Started</i> </span>
                )
                }</p>
          <p><span>Part A:</span> {student.testScore.partA} / 100</p>
          <p><span>Part B:</span> {student.testScore.partB} / 100</p>
          <p><span>Part C:</span> {student.testScore.partC} / 100</p>
          <p><span>Part D:</span> {student.testScore.partD} / 100</p>
          <p><span>Part E:</span> {student.testScore.partE} / 100</p>
          <p><span>Part F:</span> {student.testScore.partF} / 100</p>
          <div className="hr"></div>
          <p><strong>Total Score:</strong> {student.testScore.total}</p>
          <button className="primary" onClick={() => setShowResult(false)}>Close</button>
          </div>
        </div>
      )}  
    </>
  )
};

export default Homepage;
