import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const StudentDetails = ({ open, onClose, data, loading }) => {
  if (loading) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) return null;

  const { student, testAttempts } = data;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'started':
        return <AccessTimeIcon color="primary" />;
      default:
        return <CancelIcon color="error" />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold">
          Student Details
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {/* Basic Student Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Name</Typography>
              <Typography variant="h6">{student.name}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{student.email}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">TIN</Typography>
              <Typography variant="body1">{student.tin || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Test Attempts Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Test Attempts
            <Chip 
              label={`${testAttempts.length} attempts`} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {testAttempts.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No test attempts found.</Typography>
          ) : (
            testAttempts.map((attempt, index) => (
              <Accordion key={attempt._id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Attempt #{index + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(attempt.startTime).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip 
                        label={`Score: ${Math.round(attempt.scores.total * 10) / 10}%`} 
                        color={attempt.scores.total > 50 ? "success" : "error"}
                        variant="filled"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {/* Test time information */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Start Time</Typography>
                          <Typography variant="body1">{new Date(attempt.startTime).toLocaleString()}</Typography>
                        </Box>
                        {attempt.endTime && (
                          <>
                            <Box>
                              <Typography variant="body2" color="text.secondary">End Time</Typography>
                              <Typography variant="body1">{new Date(attempt.endTime).toLocaleString()}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Duration</Typography>
                              <Typography variant="body1">
                                {Math.round((new Date(attempt.endTime) - new Date(attempt.startTime)) / 60000)} minutes
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                    
                    {/* Scores table */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>Scores Breakdown</Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Part</TableCell>
                              <TableCell align="right">Score (%)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Part A</TableCell>
                              <TableCell align="right">{attempt.scores.partA || 0}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Part B</TableCell>
                              <TableCell align="right">{attempt.scores.partB || 0}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Part C</TableCell>
                              <TableCell align="right">{attempt.scores.partC || 0}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Part D</TableCell>
                              <TableCell align="right">{attempt.scores.partD || 0}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Part E</TableCell>
                              <TableCell align="right">{attempt.scores.partE || 0}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Part F</TableCell>
                              <TableCell align="right">{attempt.scores.partF || 0}</TableCell>
                            </TableRow>
                            <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                {Math.round(attempt.scores.total * 10) / 10}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    
                    {/* Test log */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Test Log</Typography>
                        {attempt.testReport && attempt.testReport.testLog && attempt.testReport.testLog.length > 0 ? (
                            <Paper 
                                variant="outlined" 
                                sx={{ 
                                    height: 300, 
                                    maxHeight: 300, 
                                    overflow: 'auto', 
                                    p: 1 
                                }}
                            >
                                <List dense disablePadding>
                                    {attempt.testReport.testLog.map((log, i) => (
                                        <ListItem key={i} divider={i < attempt.testReport.testLog.length - 1}>
                                            <ListItemText 
                                                primary={log} 
                                                primaryTypographyProps={{ 
                                                    variant: 'body2',
                                                    sx: { 
                                                        whiteSpace: 'normal', 
                                                        wordBreak: 'break-word',
                                                        fontSize: '0.85rem'
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ) : (
                            <Typography variant="body2" color="text.secondary">No test log available</Typography>
                        )}
                    </Grid>

                    {/* Display questions and answers if available */}
                    {attempt.questions && attempt.answers && (
                      <Grid item xs={12}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle2">Questions and Answers</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {['partA', 'partB', 'partC', 'partD', 'partE', 'partF'].map((part) => (
                              attempt.questions[part] && attempt.questions[part].length > 0 && (
                                <Box key={part} sx={{ mb: 3 }}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                                    Part {part.slice(-1)}
                                  </Typography>
                                  <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell width="50%">Question</TableCell>
                                          <TableCell width="50%">Answer</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {attempt.questions[part].map((q, i) => (
                                          <TableRow key={i}>
                                            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                              {q.question || q.dialog ? (
                                                q.dialog ? (
                                                  <Box>
                                                    {q.dialog.map((d, j) => (
                                                      <Typography key={j} variant="body2">
                                                        <b>{d.speaker}:</b> {d.text}
                                                      </Typography>
                                                    ))}
                                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                      Q: {q.question}
                                                    </Typography>
                                                  </Box>
                                                ) : q.question
                                              ) : ''}
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                              {attempt.answers[part] && attempt.answers[part].answers && 
                                               attempt.answers[part].answers[i] ? 
                                                attempt.answers[part].answers[i] : 'No answer'}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Box>
                              )
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetails;