import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../context/AuthContext";

// Styled components
const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: "100%",
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },
}));

const Loginpage = () => {
  const { currentUser, setCurrentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const URL = import.meta.env.VITE_API;

  const login = async (email, password) => {
    try {
      setLoading(true);
      let response = await axios.post(`${URL}/admin/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        if (response.data.role === "admin") {
          navigate("/admin");          
          setCurrentUser(response.data.userData);
        } else if (response.data.role === "trainer") {
          navigate("/trainer");
          setCurrentUser(response.data.userData);
        }
        toast.success("Login successful");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || "An error occurred"
      );
      toast.error(
        `Login failed: ${
          error.response?.data?.message || "Please check your credentials"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <Container maxWidth="sm">
        <LoginCard elevation={0}>
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                color="primary"
                fontWeight="300"
              >
                Login
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <FormField
                fullWidth
                required
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormField
                fullWidth
                required
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading ? null : <LoginIcon />}
                sx={{
                  py: 1.5,
                  mt: 1,
                  borderRadius: 1,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          </CardContent>
        </LoginCard>
      </Container>
    </LoginContainer>
  );
};

export default Loginpage;
