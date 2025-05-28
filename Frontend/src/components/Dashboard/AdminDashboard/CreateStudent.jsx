import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ExcelUpload from "../ExcelUpload";

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AlternateEmail as AlternateEmailIcon
} from '@mui/icons-material';

const CreateStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternateId, setAlternateId] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Validate phone number
      if (!/^\d+$/.test(phone)) {
        toast.error("Phone number should contain only digits");
        setLoading(false);
        return;
      }
      
      if (phone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API}/admin/students`, {
        name,
        email,
        phone,
        alternateId
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      });
      toast.success("Student created successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setAlternateId("");
    } catch (error) {
      console.error("Error creating student:", error.response?.data?.error || "Unknown error");
      toast.error("Error creating student: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h5" component="h1" color="primary" fontWeight="bold">
              Create a Student
            </Typography>
          }
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Name"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Phone"
                    placeholder="Enter 10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="outlined"
                    inputProps={{ maxLength: 10 }}
                    helperText="Phone number must be exactly 10 digits"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Alternate ID (optional)"
                    placeholder="Enter alternate email ID"
                    value={alternateId}
                    onChange={(e) => setAlternateId(e.target.value)}
                    variant="outlined"
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      minWidth: 150,
                      fontWeight: 'bold'
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? "Adding..." : "Add Student"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </CardContent>
      </Card>

      {/* Excel Upload Card */}
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" component="h1" color="primary" fontWeight="bold">
              Bulk Import
            </Typography>
          }
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          <ExcelUpload />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateStudent;