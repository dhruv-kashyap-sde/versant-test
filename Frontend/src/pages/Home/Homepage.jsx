import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Rules from "../../utils/Rules";

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
  Mic as MicIcon,
  Numbers
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 650,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}));

const ScoreItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const Homepage = () => {
  const [tin, setTin] = useState("");
  const navigate = useNavigate();
  const { verifyTin, student, setStudent } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [hasSpeechSynthesisSupport, setHasSpeechSynthesisSupport] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [resultData, setResultData] = useState(null); // Store result data separately

  useEffect(() => {
    // Check for Speech Recognition support
    const hasSpeechRecognition =
      "SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window ||
      "mozSpeechRecognition" in window ||
      "msSpeechRecognition" in window;
    setHasSpeechSupport(hasSpeechRecognition);

    // Check for Speech Synthesis support
    const hasSpeechSynthesis = "speechSynthesis" in window;
    setHasSpeechSynthesisSupport(hasSpeechSynthesis);
  }, []);

  const handleTinChange = (e) => {
    setTin(e.target.value);
  };

  const validateTin = () => {
    setTin((prevTin) => prevTin.trim()); // Trim whitespace from TIN
    if (!/^\d{10}$/.test(tin)) {
      toast.error("TIN must be a 10-digit number");
      return false;
    }
    return true;
  };

  const checkTin = async () => {
    if (!validateTin()) return;

    // Check if browser supports required speech features
    if (!hasSpeechSupport || !hasSpeechSynthesisSupport) {
      toast.error(
        "Your browser does not support speech recognition or speech synthesis. Please use a different browser like Chrome."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/tin`,
        { tin },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data && response.data.student) {
        setStudent(response.data.student);

        if (response.data.student.testStatus === "completed") {
          toast.error(
            "You have already completed the test. Please check your result."
          );
          navigate("/");
          return;
        }

        if (response.data.student.testStatus === "started") {
          toast.error(
            "You are not allowed to take the test. Please contact your instructor."
          );
          navigate("/");
          return;
        }

        if (response.status === 200) {
          toast.success("TIN verified");
          verifyTin(); // Set the verification state
          setShowRules(true);
        }
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "There was an error checking the TIN"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkResult = () => {
    if (!validateTin()) return;

    setResultLoading(true);
    axios
      .post(`${import.meta.env.VITE_API}/tin`, { tin })
      .then((response) => {
        if (response.data && response.data.student) {
          setStudent(response.data.student);
          setResultData(response.data.student); // Store result data separately
          setShowResult(true);
        } else {
          toast.error("Invalid response from server");
        }
        setResultLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to fetch results");
        setResultLoading(false);
      });
  };

  const back = () => setShowResult(false);

  // Get status chip based on test status
  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckIcon />} label="Completed" color="success" variant="filled" />;
      case 'started':
        return <Chip icon={<AccessTimeIcon />} label="Started" color="warning" variant="filled" />;
      default:
        return <Chip icon={<CloseIcon />} label="Not Started" color="error" variant="filled" />;
    }
  };

  // Safe rendering helper functions
  const renderScoreItem = (label, score) => {
    return (
      <ListItem divider>
        <ListItemText primary={label} />
        <Typography>{score !== undefined ? `${score} / 100` : "N/A"}</Typography>
      </ListItem>
    );
  };

  return (
    <>
      {showRules ? (
        <Rules inTest={true} back={back}/>
      ) : (
        <MainContainer>
          <ContentCard elevation={3}>
            <Box mb={3} textAlign="center">
              <Typography variant="h4" component="h1" color="primary" gutterBottom>
                Versant Test
              </Typography>
              <Divider />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Start your test:
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  id="tin-input"
                  label="TIN Number"
                  variant="outlined"
                  type="number"
                  inputProps={{ maxLength: 10 }}
                  value={tin}
                  onChange={handleTinChange}
                  placeholder="Enter 10-digit TIN here..."
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Numbers color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={checkTin}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MicIcon />}
                    fullWidth
                  >
                    {loading ? "Checking..." : "Start Test"}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={checkResult}
                    disabled={resultLoading}
                    startIcon={resultLoading ? <CircularProgress size={20} color="inherit" /> : <AssessmentIcon />}
                    fullWidth
                  >
                    {resultLoading ? "Loading..." : "View Result"}
                  </Button>
                </Box>
              </Box>
            </Box>

            {(!hasSpeechSupport || !hasSpeechSynthesisSupport) && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                icon={<WarningIcon />}
              >
                <AlertTitle>Browser Compatibility Issue</AlertTitle>
                Your browser does not support speech recognition or speech synthesis features 
                required for this test. Please use a modern browser like 
                <strong> Chrome</strong> or <strong>Microsoft Edge</strong>.
              </Alert>
            )}

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Check Requirements and Guide{" "}
                <Link to="/rules" style={{ color: "#1976d2" }}>
                  here
                </Link>
              </Typography>
            </Box>
          </ContentCard>

          {/* Results Dialog */}
          <Dialog
            open={showResult}
            onClose={() => setShowResult(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssessmentIcon />
                <Typography variant="h6">Test Result</Typography>
              </Stack>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              {resultData ? (
                <>
                  <Box sx={{ mb: 3, mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Test Status:
                    </Typography>
                    {getStatusChip(resultData.testStatus)}
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Only show scores if testScore exists and test is completed */}
                  {resultData.testScore && resultData.testStatus === "completed" ? (
                    <>
                      <List disablePadding>
                        {renderScoreItem("Part A", resultData.testScore.partA)}
                        {renderScoreItem("Part B", resultData.testScore.partB)}
                        {renderScoreItem("Part C", resultData.testScore.partC)}
                        {renderScoreItem("Part D", resultData.testScore.partD)}
                        {renderScoreItem("Part E", resultData.testScore.partE)}
                        {renderScoreItem("Part F", resultData.testScore.partF)}
                      </List>
                      
                      <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 1 }}>
                        <Typography variant="h6" align="center" fontWeight="bold">
                          Total Score: {resultData.testScore.total || "N/A"}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Alert severity="info">
                      <AlertTitle>No Score Available</AlertTitle>
                      The test has not been completed yet. Scores will be available after completion.
                    </Alert>
                  )}
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button 
                onClick={() => setShowResult(false)}
                variant="contained"
                color="primary"
                startIcon={<CloseIcon />}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </MainContainer>
      )}
    </>
  );
};

export default Homepage;