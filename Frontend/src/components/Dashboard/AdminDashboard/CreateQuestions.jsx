import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import A from '../QuestionParts/A';
import B from '../QuestionParts/B';
import { C } from '../QuestionParts/C';
import { D } from '../QuestionParts/D';
import { E } from '../QuestionParts/E';
import { F } from '../QuestionParts/F';

// Material UI imports
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  minWidth: 100,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ContentWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const CreateQuestions = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = ["A", "B", "C", "D", "E", "F"];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderComponent = () => {
    switch (tabLabels[activeTab]) {
      case "A":
        return <A />;
      case "B":
        return <B />;
      case "C":
        return <C />;
      case "D":
        return <D />;
      case "E":
        return <E />;
      case "F":
        return <F />;
      default:
        return <A />;
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" component="h1" color="primary" fontWeight="bold">
              Add Questions
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <StyledTabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="question parts tabs"
              >
                <StyledTab label="Part A" />
                <StyledTab label="Part B" />
                <StyledTab label="Part C" />
                <StyledTab label="Part D" />
                <StyledTab label="Part E" />
                <StyledTab label="Part F" />
              </StyledTabs>
            </Box>
            <ContentWrapper>
              {renderComponent()}
            </ContentWrapper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateQuestions;