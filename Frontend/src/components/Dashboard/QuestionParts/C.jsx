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
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Mic as MicIcon,
  RecordVoiceOver as SpeakIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Label as LabelIcon
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

const SpeakerTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  display: 'inline',
  marginRight: theme.spacing(1),
}));

export const C = () => {
  const [dialog1, setDialog1] = useState('');
  const [dialog2, setDialog2] = useState('');
  const [dialog3, setDialog3] = useState('');
  const [question, setQuestion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [partQuestions, setPartQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${import.meta.env.VITE_API}/questions/part?part=C`);
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
    
    // Validate inputs
    if (!dialog1 || !dialog2 || !dialog3 || !question || !keywords) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      // Create dialog array according to the schema
      const dialogArray = [
        { speaker: "Speaker 1", text: dialog1 },
        { speaker: "Speaker 2", text: dialog2 },
        { speaker: "Speaker 1", text: dialog3 }
      ];

      // Split keywords by comma and trim whitespace
      const keywordsArray = keywords.split(',').map(keyword => keyword.trim());

      const validQuestion = {
        dialog: dialogArray,
        question: question,
        keywords: keywordsArray
      }

      const response = await axios.post(`${import.meta.env.VITE_API}/questions/partC`, {question: validQuestion});

      toast.success("Question added successfully");
      // Reset form fields
      setDialog1('');
      setDialog2('');
      setDialog3('');
      setQuestion('');
      setKeywords('');
      // Refresh questions list
      setPartQuestions(response.data.questions);
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error(error.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/questions/${id}?part=C`);
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
        Part C: Candidates listen to a conversation between two speakers and answer a comprehension question with a word or short phrase
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Box component="form" onSubmit={handleAddQuestion}>
          <Grid container spacing={2}>
            {/* Dialog inputs */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Dialog Entries
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      required
                      fullWidth
                      label="Speaker 1 (First)"
                      placeholder="Enter the dialog of speaker 1"
                      value={dialog1}
                      onChange={(e) => setDialog1(e.target.value)}
                      variant="outlined"
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      required
                      fullWidth
                      label="Speaker 2"
                      placeholder="Enter the dialog of speaker 2"
                      value={dialog2}
                      onChange={(e) => setDialog2(e.target.value)}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <PersonIcon color="secondary" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      required
                      fullWidth
                      label="Speaker 1 (Response)"
                      placeholder="Enter the dialog of speaker 1"
                      value={dialog3}
                      onChange={(e) => setDialog3(e.target.value)}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            {/* Question and Keywords */}
            <Grid item xs={12} md={5}>
              <TextField
                required
                fullWidth
                label="Question"
                placeholder="Enter the comprehension question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <HelpIcon color="primary" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={5}>
              <TextField
                required
                fullWidth
                label="Keywords"
                placeholder="Enter keywords separated by commas"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                variant="outlined"
                helperText="Use commas ',' to separate keywords"
                InputProps={{
                  startAdornment: (
                    <LabelIcon color="primary" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? 'Adding...' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Example Box */}
      <ExampleBox elevation={2}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Example
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
            <SpeakIcon color="primary" sx={{ mt: 0.5 }} />
            <Typography variant="body1">
              <SpeakerTypography color="primary">Speaker 1:</SpeakerTypography>
              Lucy, can you come to the office early tomorrow?
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
            <SpeakIcon color="primary" sx={{ mt: 0.5 }} />
            <Typography variant="body1">
              <SpeakerTypography color="secondary">Speaker 2:</SpeakerTypography>
              Sure, what time?
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
            <SpeakIcon color="primary" sx={{ mt: 0.5 }} />
            <Typography variant="body1">
              <SpeakerTypography color="primary">Speaker 1:</SpeakerTypography>
              7:30 would be great.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
            <SpeakIcon color="primary" sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="body1">
                <SpeakerTypography>Question:</SpeakerTypography>
                What will Lucy have to do tomorrow morning?
              </Typography>
              <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight="bold">Keywords:</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="Office" color="primary" variant="outlined" />
                  <Chip size="small" label="early" color="primary" variant="outlined" />
                  <Chip size="small" label="morning" color="primary" variant="outlined" />
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <MicIcon color="primary" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="body1">
              <SpeakerTypography>Answer:</SpeakerTypography>
              "Go to the office early." or "She will go to the office at 7:30"
            </Typography>
          </Box>
        </Box>
      </ExampleBox>
      
      {/* Table of Questions */}
      <Card variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr No.</StyledTableCell>
                <StyledTableCell>Speaker 1</StyledTableCell>
                <StyledTableCell>Speaker 2</StyledTableCell>
                <StyledTableCell>Speaker 1</StyledTableCell>
                <StyledTableCell>Question</StyledTableCell>
                <StyledTableCell>Keywords</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
                    <TableCell>{q.dialog[0].text}</TableCell>
                    <TableCell>{q.dialog[1].text}</TableCell>
                    <TableCell>{q.dialog[2].text}</TableCell>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {q.keywords.map((keyword, i) => (
                          <Chip 
                            key={i} 
                            label={keyword} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete question">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteQuestion(q._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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