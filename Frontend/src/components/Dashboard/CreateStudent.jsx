import axios from "axios";
import React, { useState } from "react";

const CreateStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternateId, setAlternateId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/admin/students`, {
        name,
        email,
        phone,
        alternateId
      },
      {
        headers:{
          "Content-Type": "application/json"
        }
      }
    );
      console.log("Student created:", response.data);
    } catch (error) {
      console.error("Error creating student:", error.response.data.error);
    }
  };
  return (
    <>
      <div className="header">
        <h1 className="color">Create a Student</h1>
      </div>
      <div className='hr'></div>
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Personal Information</h2>
        <div className="form-fields">
          <label>Name:</label>
          <input
          placeholder="Enter name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Email:</label>
          <input
          placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Phone:</label>
          <input
          placeholder="Enter phone"
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label>Alternate Id:</label>
          <input
          placeholder="Enter email"
            type="email"
            value={alternateId}
            onChange={(e) => setAlternateId(e.target.value)}
          />
        </div>
        <button className="primary" type="submit">
          Add Student
        </button>
      </form>
    </>
  );
};

export default CreateStudent;
