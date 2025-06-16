import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ExcelUpload from "../ExcelUpload";
import Loader from "../../../utils/Loaders/Loader";

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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AlternateEmail as AlternateEmailIcon,
  Numbers,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Password as PasswordIcon,
  Refresh,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

const CreateTrainer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [tinAmount, setTinAmount] = useState(100);
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
                </Grid>{" "}
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
                          <PasswordIcon color="primary" />
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
                <Grid sx={{ width: "20vw" }} item xs={12} md={6}>
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
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Delete confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  // Fetch trainers when component mounts
  useEffect(() => {
    fetchTrainers();
  }, []);

  // Effect to handle filtering
  useEffect(() => {
    let result = trainers;
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = trainers.filter(
        (trainer) =>
          trainer.name.toLowerCase().includes(lowerCaseSearch) ||
          trainer.email.toLowerCase().includes(lowerCaseSearch) ||
          trainer.phone.includes(searchTerm)
      );
    }
    setFilteredTrainers(result);
    setPage(0);
  }, [trainers, searchTerm]);

  const fetchTrainers = async () => {
    setLoadingTrainers(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/admin/trainers`
      );
      setTrainers(response.data);
      setFilteredTrainers(response.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast.error("Error fetching trainers");
    } finally {
      setLoadingTrainers(false);
    }
  };

  const handleDeleteTrainer = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API}/admin/trainer/${id}`);
      setTrainers(trainers.filter((trainer) => trainer._id !== id));
      toast.success("Trainer deleted successfully!");
    } catch (error) {
      console.error("Error deleting trainer:", error);
      toast.error("Error deleting trainer");
    } finally {
      setLoading(false);
      setOpenDialog(false);
      fetchTrainers();
    }
  };

  // Dialog handlers
  const openDeleteDialog = (trainer) => {
    setTrainerToDelete(trainer);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setTrainerToDelete(null);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current trainers for display
  const currentTrainers = filteredTrainers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Styled components for table
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
  }));

  return (
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
      <CardContent>
        {/* Search controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            label="Search trainers"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredTrainers.length} trainers
            </Typography>
            <IconButton
              aria-label="refresh"
              onClick={fetchTrainers}
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Trainers Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr. N</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>TIN Allocated</StyledTableCell>
                <StyledTableCell>TIN Remaining</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingTrainers ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : currentTrainers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ py: 3 }}
                    >
                      No trainers found matching your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentTrainers.map((trainer, index) => (
                  <StyledTableRow key={trainer._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{trainer.name}</TableCell>
                    <TableCell>{trainer.email}</TableCell>
                    <TableCell>{trainer.phone || "N/A"}</TableCell>
                    <TableCell>{trainer.tinAmount || 0}</TableCell>
                    <TableCell>{trainer.tinRemaining || 0}</TableCell>
                    <TableCell>
                      {new Date(trainer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Delete Trainer">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => openDeleteDialog(trainer)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTrainers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {trainerToDelete?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteTrainer(trainerToDelete?._id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CreateTrainer;
