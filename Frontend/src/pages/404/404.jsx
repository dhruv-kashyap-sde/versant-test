import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  SentimentDissatisfied as SadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const NotFoundPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden'
}));

const NotFoundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default
}));

const BigText = styled(Typography)(({ theme }) => ({
  fontSize: '10rem',
  fontWeight: 700,
  lineHeight: 1,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '6rem',
  },
}));

const PatternBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  opacity: 0.03,
  backgroundImage: 'repeating-linear-gradient(45deg, #5c6bc0, #5c6bc0 10px, transparent 10px, transparent 20px)',
}));

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Container maxWidth="md">
        <NotFoundPaper elevation={3}>
          <PatternBackground />
          <Box position="relative" zIndex={1}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <BigText variant="h1">404</BigText>
                  <SadIcon sx={{ fontSize: 80, ml: 2, color: 'primary.main' }} />
                </Box>
                <Divider sx={{ my: 2, width: '80%', mx: 'auto' }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h4" component="h2" gutterBottom color="textPrimary">
                  Page Not Found
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4 }}>
                  The page you're looking for doesn't exist or has been moved.
                  Please check the URL or navigate back to the homepage.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to="/"
                    startIcon={<HomeIcon />}
                  >
                    Back to Home
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => window.history.back()}
                    startIcon={<ArrowBackIcon />}
                  >
                    Go Back
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </NotFoundPaper>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFound;