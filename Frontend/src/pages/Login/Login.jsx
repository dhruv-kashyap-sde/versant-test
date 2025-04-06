import React, { useState, useContext } from "react";
import "./Login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ loading, setLoading ] = useState(false);
  const URL = import.meta.env.VITE_API;
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      let response = await axios.post(`${URL}/admin/login`, { email, password }   
      );
      // console.log(response);
      
      if(response.data.success){ 
        localStorage.setItem("token", response.data.token);
        navigate("/admin");
        toast.success("Login successful")
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      toast.error(`Login failed: ${error.response.data.message}`);
    } finally{
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="login-form-container">
      <div className="login-card">
        <h2 className="fw-300"> Admin Login</h2>
        <form>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          <button disabled={loading} onClick={handleSubmit} className="primary" type="submit">
            {loading ? "Loading" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
