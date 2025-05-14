import React, { useState } from 'react';
import axios from 'axios';
import CreateStudent from './CreateStudent';
import AllStudent from './AllStudent';
import CreateQuestions from './CreateQuestions';
import SendMail from './SendMail';

// Material UI imports
import {
  Box,
  Typography,
  Divider,
  Button,
  styled
} from '@mui/material';

// Styled components that match your CSS
const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
});

const SidebarContainer = styled(Box)({
  textAlign: 'center',
  borderRight: '1px solid #50505098',
  minWidth: '200px',
  padding: '10px 15px',
  width: '15vw',
});

const LogoContainer = styled(Box)({
  height: '10vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SidebarButtons = styled(Box)({
  display: 'flex',
  gap: '10px',
  flexDirection: 'column',
});

const NavButton = styled(Button)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'whitesmoke',
  color: active ? 'whitesmoke' : 'inherit',
  padding: '10px 16px',
  textAlign: 'left',
  justifyContent: 'flex-start',
  borderRadius: '10px',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.main : theme.palette.primary.light,
  },
}));

const MainContent = styled(Box)({
  padding: '10px 15px',
  width: '85vw',
});

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("AllStudents");

  const renderComponent = () => {
    switch (activeComponent) {
      case "CreateStudent":
        return <CreateStudent />;
      case "AllStudents":
        return <AllStudent />;
      case "Questions":
        return <CreateQuestions />;
      case "SendMail":
        return <SendMail />;
      default:
        return <AllStudent />;
    }
  };

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <SidebarContainer>
        {/* <LogoContainer> */}
          <Typography variant="h5" component="h1" color="primary" sx={{ fontWeight: 'bold' , padding: '12.5px 0'}}>
            Versant
          </Typography>
        {/* </LogoContainer> */}
        <Divider sx={{ my: 1 }} />
        <SidebarButtons>
          <Button
          className={`secondary ${activeComponent === "AllStudents" ? 'active' : ''}`}
            fullWidth
            active={activeComponent === "AllStudents" ? 1 : 0}
            onClick={() => setActiveComponent("AllStudents")}
          >
            All Students
          </Button>
          
          <Button
          className={`secondary ${activeComponent === "CreateStudent" ? 'active' : ''}`}
            fullWidth
            active={activeComponent === "CreateStudent" ? 1 : 0}
            onClick={() => setActiveComponent("CreateStudent")}
          >
            Add Student
          </Button>
          
          <Button
          className={`secondary ${activeComponent === "Questions" ? 'active' : ''}`}
            fullWidth
            active={activeComponent === "Questions" ? 1 : 0}
            onClick={() => setActiveComponent("Questions")}
          >
            Add Questions
          </Button>
          
          <Button
          className={`secondary ${activeComponent === "SendMail" ? 'active' : ''}`}
            fullWidth
            active={activeComponent === "SendMail" ? 1 : 0}
            onClick={() => setActiveComponent("SendMail")}
          >
            Send Mail
          </Button>
        </SidebarButtons>
      </SidebarContainer>
      
      {/* Main content area */}
      <MainContent>
        {renderComponent()}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;