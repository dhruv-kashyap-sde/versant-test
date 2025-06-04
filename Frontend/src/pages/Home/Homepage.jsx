import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Rules from "../../utils/Rules";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  CircularProgress,
  Avatar,
  useTheme
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
  Numbers,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
  CalendarMonth as CalendarIcon
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
  const [tin, setTin] = useState("2078192584");
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
        console.log(response.data);
        
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
  
  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
    // PDF Export function
  const exportToPDF = () => {
    if (!resultData) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243); // Blue color
    doc.text("SkillVedaa Swar Test Results", 105, 20, { align: 'center' });
    
    // Add student information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${resultData.name}`, 20, 40);
    doc.text(`Email: ${resultData.email}`, 20, 50);
    doc.text(`TIN: ${resultData.tin}`, 20, 60);
    doc.text(`Phone: ${resultData.phone || "N/A"}`, 20, 70);
    doc.text(`Test Date: ${formatDate(resultData.createdAt)}`, 20, 80);
    doc.text(`Test Status: ${resultData.testStatus.toUpperCase()}`, 20, 90);
    
    // Add score table if test is completed
    if (resultData.testScore && resultData.testStatus === "completed") {
      doc.text("Test Scores:", 20, 110);
      
      const tableData = [
        ["Part A", `${resultData.testScore.partA || 0} / 100`],
        ["Part B", `${resultData.testScore.partB || 0} / 100`],
        ["Part C", `${resultData.testScore.partC || 0} / 100`],
        ["Part D", `${resultData.testScore.partD || 0} / 100`],
        ["Part E", `${resultData.testScore.partE || 0} / 100`],
        ["Part F", `${resultData.testScore.partF || 0} / 100`],
        ["Total", `${resultData.testScore.total || 0} / 100`]
      ];
      
      autoTable(doc, {
        startY: 120,
        head: [['Section', 'Score']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [33, 150, 243] },
        styles: { halign: 'center' },
        columnStyles: {
          0: { halign: 'left' },
          1: { halign: 'right' }
        }
      });
      
      // Add a note at the bottom
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(10);
      doc.text("This is an official result from the SkillVedaa Swar.", 105, finalY, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, finalY + 10, { align: 'center' });
    } else {
      doc.text("No scores available. Test has not been completed.", 105, 120, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`SkillVedaa_Swar_Result_${resultData.name.replace(/\s+/g, '_')}_${resultData.tin}.pdf`);
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
                  value={2078192584}
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
          </ContentCard>          {/* Results Dialog */}
          <Dialog
            open={showResult}
            onClose={() => setShowResult(false)}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: { borderRadius: 2 }
            }}
          >
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', px: 3, py: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssessmentIcon />
                <Typography variant="h6">Test Result</Typography>
              </Stack>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              {resultData ? (
                <Box>
                  {/* Student Information Section */}
                  <Box sx={{ bgcolor: 'background.paper', p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: { md: '1px solid #eee' } }}>
                        <Avatar 
                          sx={{ 
                            width: 100, 
                            height: 100, 
                            bgcolor: 'primary.main',
                            mb: 2,
                            fontSize: '2rem'
                          }}
                        >
                          {resultData.name ? resultData.name.charAt(0).toUpperCase() : 'S'}
                        </Avatar>
                        <Typography variant="h6" align="center" gutterBottom>
                          {resultData.name}
                        </Typography>
                        <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getStatusChip(resultData.testStatus)}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom color="primary">
                          Student Information
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <EmailIcon color="primary" fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                Email
                              </Typography>
                            </Stack>
                            <Typography variant="body1">
                              {resultData.email}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <Numbers color="primary" fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                TIN
                              </Typography>
                            </Stack>
                            <Typography variant="body1">
                              {resultData.tin}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <PhoneIcon color="primary" fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                Phone Number
                              </Typography>
                            </Stack>
                            <Typography variant="body1">
                              {resultData.phone || "Not provided"}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <CalendarIcon color="primary" fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                Test Date
                              </Typography>
                            </Stack>
                            <Typography variant="body1">
                              {formatDate(resultData.createdAt)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider />
                  
                  {/* Test Results Section */}
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssessmentIcon sx={{ mr: 1 }} />
                      Test Results
                    </Typography>
                    
                    {/* Only show scores if testScore exists and test is completed */}
                    {resultData.testScore && resultData.testStatus === "completed" ? (
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          {/* Score cards for each part */}
                          <Grid item xs={6} sm={4} md={2}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary.main">
                                  Part A
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                  {resultData.testScore.partA || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  out of 100
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={6} sm={4} md={2}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary.main">
                                  Part B
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                  {resultData.testScore.partB || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  out of 100
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={6} sm={4} md={2}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary.main">
                                  Part C
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                  {resultData.testScore.partC || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  out of 100
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={6} sm={4} md={2}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary.main">
                                  Part D
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                  {resultData.testScore.partD || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  out of 100
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={6} sm={4} md={2}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary.main">
                                  Part E
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                  {resultData.testScore.partE || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  out of 100
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={6} sm={4} md={2}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h6" color="primary.main">
                                  Part F
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                  {resultData.testScore.partF || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  out of 100
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                        
                        {/* Total Score */}
                        <Card 
                          elevation={3} 
                          sx={{ 
                            mt: 3, 
                            p: 2, 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            borderRadius: 2
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                              Total Score
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                              {resultData.testScore.total || 0}
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    ) : (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <AlertTitle>No Score Available</AlertTitle>
                        The test has not been completed yet. Scores will be available after completion.
                      </Alert>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
              {resultData && resultData.testStatus === "completed" && (
                <Button 
                  onClick={exportToPDF}
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                >
                  Download PDF
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
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