import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'
import CreateStudent from './CreateStudent';
import AllStudent from './AllStudent';
import CreateQuestions from './CreateQuestions';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Questions");

  // const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case "CreateStudent":
        return <CreateStudent />;
      case "AllStudents":
        return <AllStudent />;
      case "Questions":
        return <CreateQuestions />;
      default:
        return <AllStudent />;
    }
  };


  return (
    <div className='dashboard-container'>
      <div className="sidebar-container relative">
        <div className="logo-container">
          <h1 className="color">Versant</h1>
        </div>
        <div className="hr"></div>
        <div className="sidebar-buttons">
          <button className={`${activeComponent === "AllStudents" && 'active' } secondary`} onClick={() => setActiveComponent("AllStudents")}>All Students</button>
          <button className={`${activeComponent === "CreateStudent" && 'active' } secondary`} onClick={() => setActiveComponent("CreateStudent")}>Add Student</button>
          <button className={`${activeComponent === "Questions" && 'active' } secondary`} onClick={() => setActiveComponent("Questions")}>Add Questions</button>
        </div>
      </div>
      <div className="dashboard-body">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;