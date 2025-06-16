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
  Grid,
  Card,
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

const EllipsisTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: theme.spacing(0, 1),
  display: 'flex',
  alignItems: 'center',
}));

const B = () => {
  const [phrase1, setPhrase1] = useState('');
  const [phrase2, setPhrase2] = useState('');
  const [phrase3, setPhrase3] = useState('');
  const [rearranged, setRearranged] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // for the generated question
  const [partQuestions, setPartQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=B`);
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
    
    if (!phrase1.trim() || !phrase2.trim() || !phrase3.trim() || !rearranged.trim()) {
      toast.error("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      // Create the concatenated question string with "..." between phrases
      const questionText = `${phrase1}... ${phrase2}... ${phrase3}`;
      
      // Send the question to the backend
      const response = await axios.post(`${import.meta.env.VITE_API}/questions/partB`, {
        question: questionText,
        rearranged: rearranged,
      });
      setPartQuestions(response.data.questions); // Update the state with the new question
      
      // Reset form fields
      setPhrase1('');
      setPhrase2('');
      setPhrase3('');
      setRearranged('');
      
      toast.success("Question added successfully!");
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=B`);
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
        Part B: Candidates hear three short phrases and are asked to rearrange them to make a sentence
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Box component="form" onSubmit={handleAddQuestion}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
                <TextField
                  required
                  label="Phrase 1"
                  placeholder="Enter the first phrase"
                  value={phrase1}
                  onChange={(e) => setPhrase1(e.target.value)}
                  variant="outlined"
                  autoFocus
                  sx={{ flexGrow: 1, minWidth: '150px' }}
                />
                <EllipsisTypography>...</EllipsisTypography>
                <TextField
                  required
                  label="Phrase 2"
                  placeholder="Enter the second phrase"
                  value={phrase2}
                  onChange={(e) => setPhrase2(e.target.value)}
                  variant="outlined"
                  sx={{ flexGrow: 1, minWidth: '150px' }}
                />
                <EllipsisTypography>...</EllipsisTypography>
                <TextField
                  required
                  label="Phrase 3"
                  placeholder="Enter the third phrase"
                  value={phrase3}
                  onChange={(e) => setPhrase3(e.target.value)}
                  variant="outlined"
                  sx={{ flexGrow: 1, minWidth: '150px' }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={9}>
              <TextField
                required
                fullWidth
                label="Rearranged Sentence"
                placeholder="Enter the complete rearranged sentence"
                value={rearranged}
                onChange={(e) => setRearranged(e.target.value)}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? 'Adding...' : 'Add Question'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
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
                Left immediately... after the meeting ended... the sales man.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <MicIcon color="primary" />
              <Typography variant="body1">
                The salesman left immediately after the meeting ended.
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
                <StyledTableCell width="5%">Sr No.</StyledTableCell>
                <StyledTableCell width="40%">Phrases</StyledTableCell>
                <StyledTableCell width="40%">Rearranged</StyledTableCell>
                <StyledTableCell width="15%">Actions</StyledTableCell>
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
                    <TableCell>{q.question}</TableCell>
                    <TableCell>{q.rearranged}</TableCell>
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

export default B;