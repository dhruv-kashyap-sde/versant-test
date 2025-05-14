import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import toast from "react-hot-toast";
import Loader from "../../../utils/Loaders/Loader";

// Material UI imports
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Card,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  RecordVoiceOver as SpeakIcon,
  Edit as PencilIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const ExampleBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1]
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

export const E = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [partQuestions, setPartQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=E`);
      setPartQuestions(response.data.questions);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Failed to fetch questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setLoading(true);
    try {
      let response = await axios.post(`${import.meta.env.VITE_API}/questions/partE`, { question });
      toast.success("Question added successfully");
      setPartQuestions(response.data.questions);
      setQuestion('');
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=E`);
      setPartQuestions(partQuestions.filter(q => q._id !== id));
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast.error("Failed to delete question");
    }
  };

  return (
    <Box>
      <Typography variant="h6" component="h3" gutterBottom color="primary" fontWeight="medium">
        Part E: Candidates hear a sentence and must type the sentence exactly as they hear it
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Box component="form" onSubmit={handleAddQuestion} sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            required
            label="Question"
            placeholder="Enter the question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            variant="outlined"
            autoFocus
            fullWidth
            sx={{ flexGrow: 1, minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SpeakIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disabled={loading}
            sx={{ height: 56 }}
          >
            {loading ? 'Adding...' : 'Add Question'}
          </Button>
        </Box>
      </Paper>
      
      <ExampleBox elevation={2}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Example
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <SpeakIcon color="primary" />
            <Typography variant="body1">
              Can you work on Monday? Yes I can.
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <PencilIcon color="primary" />
            <Typography variant="body1">
              Can you work on Monday? Yes I can.
            </Typography>
          </Box>
        </Box>
      </ExampleBox>
      
      <Card variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width="10%">Sr No.</StyledTableCell>
                <StyledTableCell width="75%">Question</StyledTableCell>
                <StyledTableCell width="15%">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : partQuestions.length > 0 ? (
                partQuestions.map((q, index) => (
                  <TableRow 
                    key={q._id || index}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete question">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteQuestion(q._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No questions added yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};