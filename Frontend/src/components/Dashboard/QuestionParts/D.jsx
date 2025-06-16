import axios from "axios";
import { useEffect, useState, Fragment } from "react"; // Add Fragment here
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
  InputAdornment,
    Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  VisibilityOutlined as EyeIcon,
  Edit as PencilIcon,
  Info as InfoIcon
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

export const D = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [partQuestions, setPartQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=D`);
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
    
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    // Validate question contains underscore for blank space
    if (!question.includes('_')) {
      toast.error("Question must contain at least one underscore (_) for blank space");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/questions/partD`, { question, answer });
      toast.success("Question added successfully");
      setPartQuestions(response.data.questions);
      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=D`);
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
        Part D: Candidates read a sentence with a missing word and write an appropriate word to complete the sentence.
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 2, bgcolor: 'background.paper' }}>
        <Box component="form" onSubmit={handleAddQuestion} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <TextField
            required
            label="Question with blank"
            placeholder="Enter the question with underscore for blank..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            variant="outlined"
            autoFocus
            fullWidth
            sx={{ flexGrow: 3, minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EyeIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            required
            label="Answer"
            placeholder="Enter the answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            variant="outlined"
            sx={{ flexGrow: 1, minWidth: '150px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PencilIcon color="primary" />
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
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </Box>
        
        <Alert 
          icon={<InfoIcon fontSize="inherit" />} 
          severity="info"
          sx={{ mt: 1 }}
        >
          Use underscore ( _ ) for blank spaces in your question.
        </Alert>
      </Paper>
      
      <ExampleBox elevation={2}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Example
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <EyeIcon color="primary" />
            <Typography variant="body1">
              It's <Box component="span" fontWeight="bold" sx={{ textDecoration: 'underline' }}>____</Box> tonight. Bring your sweater.
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <PencilIcon color="primary" />
            <Typography variant="body1" fontWeight="medium" color="success.main">
              Cold
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
                <StyledTableCell width="45%">Question</StyledTableCell>
                <StyledTableCell width="35%">Answer</StyledTableCell>
                <StyledTableCell width="10%">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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
                    <TableCell>
                      {q.question.split('_').map((part, i, arr) => (
                        <Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <Box 
                              component="span" 
                              sx={{ 
                                display: 'inline-block', 
                                width: '30px', 
                                borderBottom: '1px solid', 
                                mx: 0.5 
                              }}
                            />
                          )}
                        </Fragment>
                      ))}
                    </TableCell>
                    <TableCell>{q.answer}</TableCell>
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
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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