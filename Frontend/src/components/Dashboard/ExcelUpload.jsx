import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Material UI imports
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import {
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const ExampleTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
}));

const SuccessTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  }
}));

const ErrorTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  }
}));

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    // Check file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/admin/students/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
      if (response.data.errors && response.data.errors.length > 0) {
        toast.error("Some students could not be added. Check the errors.");
      } else toast.success("Students added successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during upload");
      toast.error(
        err.response?.data?.error || "An error occurred during upload"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom fontWeight="medium" color="primary">
            Import Students from Excel
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ borderRadius: 2 }}
              >
                Select Excel File
                <VisuallyHiddenInput 
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  name="file"
                />
              </Button>
              {file && (
                <Typography variant="body2">
                  Selected: {file.name}
                </Typography>
              )}
            </Box>
            
            <Button 
              variant="contained" 
              type="submit" 
              disabled={loading || !file}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
              sx={{ mt: 1 }}
            >
              {loading ? "Uploading..." : "Upload Excel"}
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Excel File Format Guide
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Required Columns:"
                    secondary={
                      <Typography component="span" variant="body2">
                        Your Excel file must include these columns with exact names.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              
              <List sx={{ pl: 4 }}>
                <ListItem>
                  <ListItemText 
                    primary="name"
                    secondary="Student's full name (required)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="email" 
                    secondary="Student's email address (required)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="phone" 
                    secondary="Student's phone number (required)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="alternateId" 
                    secondary="Any alternate identification (optional)"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Example Format
              </Typography>
              
              <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>name</StyledTableCell>
                      <StyledTableCell>email</StyledTableCell>
                      <StyledTableCell>phone</StyledTableCell>
                      <StyledTableCell>alternateId</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <ExampleTableCell>John Doe</ExampleTableCell>
                      <ExampleTableCell>john@example.com</ExampleTableCell>
                      <ExampleTableCell>1234567890</ExampleTableCell>
                      <ExampleTableCell>alternate1@email.com</ExampleTableCell>
                    </TableRow>
                    <TableRow>
                      <ExampleTableCell>Jane Smith</ExampleTableCell>
                      <ExampleTableCell>jane@example.com</ExampleTableCell>
                      <ExampleTableCell>9876543210</ExampleTableCell>
                      <ExampleTableCell>alternate2@email.com</ExampleTableCell>
                    </TableRow>
                    <TableRow>
                      <ExampleTableCell>Mike Johnson</ExampleTableCell>
                      <ExampleTableCell>mike@example.com</ExampleTableCell>
                      <ExampleTableCell>5556667777</ExampleTableCell>
                      <ExampleTableCell>alternate3@email.com</ExampleTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          
          {result && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Import Results
              </Typography>
              <Typography variant="body1" paragraph>
                {result.message}
              </Typography>
              
              {result.success && result.success.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Successfully Imported ({result.success.length})
                    </Typography>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <SuccessTableCell>Name</SuccessTableCell>
                          <SuccessTableCell>Email</SuccessTableCell>
                          <SuccessTableCell>Phone</SuccessTableCell>
                          <SuccessTableCell>TIN</SuccessTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.success.map((student, index) => (
                          <TableRow key={index}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.phone}</TableCell>
                            <TableCell>{student.tin}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              
              {result.errors && result.errors.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ErrorIcon color="error" />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Failed Entries ({result.errors.length})
                    </Typography>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <ErrorTableCell>Data</ErrorTableCell>
                          <ErrorTableCell>Error</ErrorTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {JSON.stringify(error.row, null, 2)}
                              </pre>
                            </TableCell>
                            <TableCell sx={{ color: 'error.main' }}>
                              {error.error}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExcelUpload;