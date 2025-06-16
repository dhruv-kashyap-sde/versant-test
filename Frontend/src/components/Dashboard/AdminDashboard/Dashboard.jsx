import React, { useState } from "react";
import axios from "axios";
import CreateStudent from "./CreateStudent";
import AllStudent from "./AllStudent";
import CreateQuestions from "./CreateQuestions";
import SendMail from "../SendMail";

// Material UI imports
import { Box, Typography, Divider, Button, styled } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CreateTrainer from "./CreateTrainer";
import {
  EditNote,
  Group,
  Groups3,
  Logout,
  Mail,
  PeopleAlt,
  Person,
  PersonAdd,
  TvOff,
} from "@mui/icons-material";

// Styled components that match your CSS
const DashboardContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
});

const SidebarContainer = styled(Box)({
  textAlign: "center",
  borderRight: "1px solid #50505098",
  minWidth: "200px",
  padding: "10px 15px",
  width: "15vw",
});

const LogoContainer = styled(Box)({
  height: "10vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SidebarButtons = styled(Box)({
  display: "flex",
  gap: "10px",
  flexDirection: "column",
});

const NavButton = styled(Button)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : "whitesmoke",
  color: active ? "whitesmoke" : "inherit",
  padding: "10px 16px",
  textAlign: "left",
  justifyContent: "flex-start",
  borderRadius: "10px",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.primary.light,
  },
}));

const MainContent = styled(Box)({
  padding: "10px 15px",
  width: "85vw",
});

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("AllStudents");

  const renderComponent = () => {
    switch (activeComponent) {
      case "CreateStudent":
        return <CreateStudent />;
      case "AllStudents":
        return <AllStudent />;
      case "CreateTrainer":
        return <CreateTrainer />;
      case "Questions":
        return <CreateQuestions />;
      case "SendMail":
        return <SendMail isAdmin={true}/>;
      default:
        return <AllStudent />;
    }
  };

  const logoutUser = async () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  }

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <SidebarContainer>
        <Typography
          variant="h5"
          component="h1"
          color="primary"
          sx={{ fontWeight: "bold", padding: "12.5px 0" }}
          onClick={()=> window.location.href = "/"}
          style={{ cursor: "pointer" }} // Make the logo clickable
        >
          SkillVedaa Swar
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "85vh", // Adjust height to fit the sidebar
          }}
        >
          <SidebarButtons>
            <Button
              className={`secondary ${
                activeComponent === "AllStudents" ? "active" : ""
              }`}
              fullWidth
              active={activeComponent === "AllStudents" ? 1 : 0}
              onClick={() => setActiveComponent("AllStudents")}
              startIcon={<Groups3 />}
            >
              All Students
            </Button>

            <Button
              className={`secondary ${
                activeComponent === "CreateStudent" ? "active" : ""
              }`}
              fullWidth
              active={activeComponent === "CreateStudent" ? 1 : 0}
              onClick={() => setActiveComponent("CreateStudent")}
              startIcon={<PersonAdd />}
            >
              Add Student
            </Button>

            <Button
              className={`secondary ${
                activeComponent === "CreateTrainer" ? "active" : ""
              }`}
              fullWidth
              active={activeComponent === "CreateTrainer" ? 1 : 0}
              onClick={() => setActiveComponent("CreateTrainer")}
              startIcon={<GroupAddIcon />}
            >
              Create Trainer
            </Button>

            <Button
              className={`secondary ${
                activeComponent === "Questions" ? "active" : ""
              }`}
              fullWidth
              active={activeComponent === "Questions" ? 1 : 0}
              onClick={() => setActiveComponent("Questions")}
              startIcon={<EditNote />}
            >
              Add Questions
            </Button>

            <Button
              className={`secondary ${
                activeComponent === "SendMail" ? "active" : ""
              }`}
              fullWidth
              active={activeComponent === "SendMail" ? 1 : 0}
              onClick={() => setActiveComponent("SendMail")}
              startIcon={<Mail />}
            >
              Send Mail
            </Button>
          </SidebarButtons>
          <Button
            className={`secondary 
            }`}
            fullWidth
            onClick={logoutUser}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Box>
      </SidebarContainer>

      {/* Main content area */}
      <MainContent>{renderComponent()}</MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
