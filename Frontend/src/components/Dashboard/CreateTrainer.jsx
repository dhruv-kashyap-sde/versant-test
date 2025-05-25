import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ExcelUpload from "./ExcelUpload";

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
  CircularProgress,
  Slider,
  Stack,
  Table,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AlternateEmail as AlternateEmailIcon,
  Numbers,
} from "@mui/icons-material";

const CreateTrainer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [tinAmount, setTinAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
  fetchAllTrainers();
  }, []);
  
  const fetchAllTrainers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/admin/trainers`
      );
      console.log("Fetched trainers:", response.data);
      
    } catch (error) {
      console.error("Error in first useEffect:", error);
      
    }
   }

  const handleSubmit = async (e) => {
    console.log(password.length);
    
    e.preventDefault();
    try {
      setLoading(true);
      // Validate phone number
      if (!/^\d+$/.test(phone)) {
        toast.error("Phone number should contain only digits");
        setLoading(false);
        return;
      }

      if (!name || !email || !phone || !password) {
        toast.error("All fields are required");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (phone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API}/admin/trainer`,
        {
          name,
          email,
          phone,
          password,
          tinAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Trainer created successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setTinAmount("");
    } catch (error) {
      console.error(
        "Error creating Trainer:",
        error.response?.data?.error || "Unknown error"
      );
      toast.error(
        "Error creating Trainer: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
      fetchAllTrainers();
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography
              variant="h5"
              component="h1"
              color="primary"
              fontWeight="bold"
            >
              Create a Trainer
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box sx={{ borderRadius: 2 }}>
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
                    type="password"
                    helperText="Password must be at least 6 characters long"
                    label="Password"
                    placeholder="Set a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Grid sx={{width: '20vw'}} item xs={12} md={6}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    color="primary"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Numbers color="primary" sx={{ mr: 1 }} />
                    Number of TINs
                  </Typography>
                  <Stack
                    spacing={2}
                    direction="row"
                    sx={{ mb: 1 }}
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      10
                    </Typography>
                    <Slider
                      value={tinAmount}
                      onChange={(e, newValue) => setTinAmount(newValue)}
                      aria-labelledby="tin-amount-slider"
                      valueLabelDisplay="on"
                      step={10}
                      marks
                      min={10}
                      max={500}
                      color="primary"
                    />
                    <Typography variant="body2" color="text.secondary">
                      500
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Selected: {tinAmount} TINs
                  </Typography>
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
                      fontWeight: "bold",
                    }}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {loading ? "Adding..." : "Add Trainer"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <AllTrainers />
    </Box>
  );
};

const AllTrainers = () => {
  return (
    <>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography
              variant="h5"
              component="h1"
              color="primary"
              fontWeight="bold"
            >
              All Trainers
            </Typography>
          }
        />
        <Divider />
      </Card>
    </>
  );
};

export default CreateTrainer;
