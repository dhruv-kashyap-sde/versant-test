import axios from "axios";
import { useEffect, useState } from "react";
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
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Mic as MicIcon,
  RecordVoiceOver as SpeakIcon
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

const A = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [partQuestions, setPartQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=A`);
      setPartQuestions(response.data.questions);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Failed to fetch questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const newQuestion = { question };
      const response = await axios.post(`${import.meta.env.VITE_API}/questions/partA`, newQuestion);
      setPartQuestions(response.data.questions);
      setQuestion('');
      toast.success("Question added successfully");
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=A`);
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
        Part A: Candidates are asked to repeat sentences that they hear
      </Typography>
      
      <Box component="form" 
        onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }} 
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Question"
          placeholder="Enter the question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: '70%' }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disabled={loading || !question.trim()}
          type="submit"
          sx={{ height: 56 }}
        >
          {loading ? 'Adding...' : 'Add Question'}
        </Button>
      </Box>
      
      <ExampleBox elevation={2}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Example
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <SpeakIcon color="primary" />
              <Typography variant="body1">
                "With all the good programs available it's difficult to make a quick decision."
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <MicIcon color="primary" />
              <Typography variant="body1">
                "With all the good programs available it's difficult to make a quick decision."
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </ExampleBox>
      
      <Card variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width="10%">Sr No.</StyledTableCell>
                <StyledTableCell width="70%">Question</StyledTableCell>
                <StyledTableCell width="20%">Actions</StyledTableCell>
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
                    key={q._id}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete question">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteQuestion(q._id)}
                          disabled={loading}
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

export default A;