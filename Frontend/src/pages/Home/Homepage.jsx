import React, { useState } from "react";
import "./Homepage.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Homepage = () => {
  const [tin, setTin] = useState('2365773761');
  const navigate = useNavigate();
  const { verifyTin } = useAuth();

  const handleTinChange = (e) => {
    setTin(e.target.value);
  };

  const validateTin = () => {
    if (!/^\d{10}$/.test(tin)) {
      toast.error('TIN must be a 10-digit number');
      return false;
    }
    return true;
  };

  const checkTin = () => {
    if (!validateTin()) return;

    navigate('/start-test');
    // axios.post(`${import.meta.env.VITE_API}/tin`, { tin })
    //   .then(response => {
    //     console.log(response);

    //     if (response.status === 200) {
    //       toast.success('TIN verified');
    //       verifyTin(); // Set the verification state
    //       navigate('/start-test'); // Navigate to the StartTest component
    //     } 
    //   })
    //   .catch(error => {
    //     // toast.error('There was an error checking the TIN');
    //     toast.error(`${error.response.data.message}`);
    //     console.log('There was an error checking the TIN!', error);
    //   });
  };

  return (
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
            type="text"
            maxLength={10}
            value={tin}
            onChange={handleTinChange}
            name="tin"
            placeholder="Enter TIN here..."
          />
          <button onClick={checkTin} className="primary mr-10">
            Start Test
          </button>
          <button className="secondary mr-10">Result</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
