import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import SendMail from "../SendMail";
import Loader from "../../../utils/Loaders/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Material UI imports
import {
  Box,
  Typography,
  Divider,
  Button,
  styled,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  InputAdornment,
  LinearProgress,
  Tooltip,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  alpha,
} from "@mui/material";

import {
  GroupAdd as GroupAddIcon,
  Group as GroupIcon,
  Mail as MailIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AlternateEmail as AlternateEmailIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  SwapVert as SwapVertIcon,
  Info as InfoIcon,
  FileDownload as FileDownloadIcon,
  Password,
  RemoveRedEye,
} from "@mui/icons-material";

// Styled components
const DashboardContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
});

const SidebarContainer = styled(Box)({
  textAlign: "center",
  borderRight: "1px solid #50505098",
  minWidth: "200px",
  padding: "10px 15px",
  width: "15vw",
});

const LogoContainer = styled(Box)({
  height: "10vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SidebarButtons = styled(Box)({
  display: "flex",
  gap: "10px",
  flexDirection: "column",
});

const NavButton = styled(Button)(({ theme, active }) => ({
  justifyContent: "flex-start",
  padding: "10px 15px",
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  color: active ? "white" : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.action.hover,
  },
}));

const ContentContainer = styled(Box)({
  padding: "20px",
  width: "85vw",
  overflowY: "auto",
});

const TinUsageCard = styled(Card)({
  marginBottom: "20px",
});

const TinProgressBar = styled(LinearProgress)({
  height: 10,
  borderRadius: 5,
});

// Styled components for student table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const ScorePopover = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "250px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(2),
  zIndex: 1,
  display: "none",
  "& .MuiDivider-root": {
    margin: theme.spacing(1, 0),
  },
  ".score-cell:hover &": {
    display: "block",
  },
}));

const ScoreWrapper = styled(Box)({
  position: "relative",
  cursor: "pointer",
});

// Main TrainerDashboard component
const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  //   const [currentUser, setTrainerData] = useState(null);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token)
        toast.error("You are not logged in. Please log in to continue.");
      const response = await axios.post(
        `${import.meta.env.VITE_API}/admin/dashboard`,
        { token }
      );
      console.log(response.data);

      setCurrentUser(response.data.trainer);
    } catch (error) {
      console.error("Error fetching trainer data:", error);
      toast.error("Could not load trainer information");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <TrainerOverview
            currentUser={currentUser}
            refreshData={fetchTrainerData}
          />
        );
      case "addStudent":
        return (
          <AddStudent
            currentUser={currentUser}
            refreshData={fetchTrainerData}
          />
        );
      case "viewStudents":
        return <AllStudents />;
      case "sendMail":
        return <SendMail isAdmin={false} />;
      default:
        return (
          <TrainerOverview
            currentUser={currentUser}
            refreshData={fetchTrainerData}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <SidebarContainer>
        <Typography
          variant="h5"
          component="h1"
          color="primary"
          sx={{ fontWeight: "bold", padding: "12.5px 0" }}
          onClick={() => (window.location.href = "/")}
          style={{ cursor: "pointer" }} // Make the logo clickable
        >
          SkillVedaa Swar
        </Typography>
        <Divider sx={{ my: 1 }} />

        <SidebarButtons>
          <NavButton
            startIcon={<DashboardIcon />}
            active={activeTab === "dashboard" ? 1 : 0}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </NavButton>

          <NavButton
            startIcon={<GroupAddIcon />}
            active={activeTab === "addStudent" ? 1 : 0}
            onClick={() => setActiveTab("addStudent")}
          >
            Add Student
          </NavButton>

          <NavButton
            startIcon={<GroupIcon />}
            active={activeTab === "viewStudents" ? 1 : 0}
            onClick={() => setActiveTab("viewStudents")}
          >
            View Students
          </NavButton>
{/* 
          <NavButton
            startIcon={<UploadIcon />}
            active={activeTab === "bulkUpload" ? 1 : 0}
            onClick={() => setActiveTab("bulkUpload")}
          >
            Bulk Upload
          </NavButton> */}

          <NavButton
            startIcon={<MailIcon />}
            active={activeTab === "sendMail" ? 1 : 0}
            onClick={() => setActiveTab("sendMail")}
          >
            Send Mail
          </NavButton>
        </SidebarButtons>

        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            width: "15vw",
            pl: 2,
            pr: 3,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </SidebarContainer>

      {/* Main Content */}
      <ContentContainer>{renderContent()}</ContentContainer>
    </DashboardContainer>
  );
};

// TrainerOverview component to display TIN usage and stats
const TrainerOverview = ({ currentUser, refreshData }) => {
  const tinUsed = currentUser?.tinAmount - currentUser?.tinRemaining || 0;
  const tinTotal = currentUser?.tinAmount || 0;
  const tinRemaining = currentUser?.tinRemaining || 0;
  const usagePercentage = (tinUsed / tinTotal) * 100 || 0;

  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/trainer/students`, {token: localStorage.getItem("token")}
      );
      setStats(response.data);
      console.log("Fetched stats:", response.data);
      
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const requestMoreTin = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/trainer/request-tin`);
      toast.success("Request for more TINs has been sent to the admin");
    } catch (error) {
      console.error("Error requesting more TIN:", error);
      toast.error("Failed to request more TINs");
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Trainer Dashboard
      </Typography>
      <Divider sx={{ mb: 1 }} />

      {/* TIN Usage Card */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "top",
          gap: "20px",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <TinUsageCard>
            <CardHeader title="TIN Allocation" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  You have used <strong>{tinUsed}</strong> out of{" "}
                  <strong>{tinTotal}</strong> TINs ({tinRemaining} remaining)
                </Typography>
                <TinProgressBar
                  variant="determinate"
                  value={usagePercentage}
                  color={usagePercentage > 90 ? "error" : "primary"}
                />
              </Box>

              {usagePercentage > 80 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={requestMoreTin}
                  sx={{ mt: 1 }}
                >
                  Request More TINs
                </Button>
              )}
            </CardContent>
          </TinUsageCard>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Statistics
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card elevation={2}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                    Total Students
                    </Typography>
                    <Typography variant="h3">{stats.length}</Typography>
                  </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card elevation={2}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                    Completed Tests
                    </Typography>
                    <Typography variant="h3" color="success.main">
                    {stats.filter(student => student.testStatus === 'completed').length}
                    </Typography>
                  </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card elevation={2}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                    Pending Tests
                    </Typography>
                    <Typography variant="h3" color="warning.main">
                    {stats.filter(student => student.testStatus !== 'completed').length}
                    </Typography>
                  </CardContent>
                  </Card>
                </Grid>
                </Grid>
              </Box>
              <Box
                sx={{ width: "50%"}}
              >
                <Card elevation={2}>
                <CardHeader 
                  title={`Welcome, ${currentUser?.name || "Trainer"}`}
                  subheader="Your account details"
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="body1" fontWeight="medium">User ID:</Typography>
                    <Typography variant="body2" color="text.secondary">
                    {currentUser?._id || "Not available"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="primary" />
                    <Typography variant="body1" fontWeight="medium">Email:</Typography>
                    <Typography variant="body2" color="text.secondary">
                    {currentUser?.email || "Not available"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body1" fontWeight="medium">Phone:</Typography>
                    <Typography variant="body2" color="text.secondary">
                    {currentUser?.phone || "Not provided"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Password color="primary" />
                    <Typography variant="body1" fontWeight="medium">Password:</Typography>
                    <Typography variant="body2" color="text.secondary">
                    Sent on email
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon color="primary" />
                    <Typography variant="body1" fontWeight="medium">Created On:</Typography>
                    <Typography variant="body2" color="text.secondary">
                    {currentUser?.createdAt 
                      ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      : "Not available"}
                    </Typography>
                  </Box>
                  </Box>
                </CardContent>
                </Card>
              </Box>
              </Box>

              {/* Password display component with toggle */}
              {function PasswordDisplay({ password }) {
              const [showPassword, setShowPassword] = useState(false);
              
              const togglePasswordVisibility = () => {
                setShowPassword(!showPassword);
              };
              
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlternateEmailIcon color="primary" />
                <Typography variant="body1" fontWeight="medium">Password:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {showPassword ? password : '••••••••'}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={togglePasswordVisibility}
                  sx={{ ml: 1 }}
                >
                  {showPassword ? (
                  <Tooltip title="Hide password">
                    <CancelIcon fontSize="small" />
                  </Tooltip>
                  ) : (
                  <Tooltip title="Show password">
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                  )}
                </IconButton>
                </Box>
              );
              }}

              {/* Recent Activity (placeholder) */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Recent Activity
      </Typography>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Recent student activities will appear here.
        </Typography>
      </Paper>
    </>
  );
};

// AddStudent component for manual student creation
const AddStudent = ({ currentUser, refreshData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternateId, setAlternateId] = useState("");
  const [loading, setLoading] = useState(false);

  const tinUsed = currentUser?.tinUsed || 0;
  const tinTotal = currentUser?.tinAmount || 0;
  const tinRemaining = tinTotal - tinUsed;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tinRemaining <= 0) {
      toast.error(
        "You have used all your allocated TINs. Please request more from admin."
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token)
        toast.error("You are not logged in. Please log in to continue.");
      // Validate phone number if provided
      if (phone && (!/^\d+$/.test(phone) || phone.length !== 10)) {
        toast.error("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API}/trainer/student`,
        {
          name,
          email,
          phone: phone || undefined,
          alternateId: alternateId || undefined,
          token,
        }
      );

      toast.success("Student created successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setAlternateId("");

      // Refresh trainer data to update TIN usage
      refreshData();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error(error.response?.data?.error || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Student
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* TIN Allocation Info */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          color={tinRemaining > 0 ? "primary" : "error"}
        >
          {tinRemaining > 0
            ? `You have ${tinRemaining} TINs remaining out of ${tinTotal} total allocated.`
            : "You have used all your allocated TINs. Please request more from admin."}
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardHeader
          title="Student Information"
          subheader="Fields marked with * are required"
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  placeholder="Enter student's full name"
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
                  placeholder="Enter student's email address"
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
                  label="Phone"
                  placeholder="Enter student's 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                  inputProps={{ maxLength: 10 }}
                  helperText="Optional. If provided, must be exactly 10 digits"
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
                  label="Alternate ID"
                  placeholder="Enter an alternate identifier (optional)"
                  value={alternateId}
                  onChange={(e) => setAlternateId(e.target.value)}
                  variant="outlined"
                  helperText="Optional. Any identifier you want to associate with this student"
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
                  disabled={loading || tinRemaining <= 0}
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
                  {loading ? "Adding..." : "Add Student"}
                </Button>
                {tinRemaining <= 0 && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    No TINs available
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

// AllStudents component for Trainer Dashboard
const AllStudents = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Reset test status dialog
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [studentToReset, setStudentToReset] = useState(null);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API}/trainer/students`, { token }
      );
      console.log(response.data);
      
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students");
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Effect to handle filtering and sorting
  useEffect(() => {
    let result = students;
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowerCaseSearch) ||
          student.email.toLowerCase().includes(lowerCaseSearch) ||
          student.tin.toString().includes(searchTerm) ||
          student.testScore.total.toString().includes(searchTerm)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortField === "score") {
        if (sortDirection === "asc") {
          return a.testScore.total - b.testScore.total;
        } else {
          return b.testScore.total - a.testScore.total;
        }
      }

      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sortField === "testStatus") {
        const statusOrder = { completed: 2, started: 1, "not started": 0 };
        const statusA = statusOrder[a.testStatus] || 0;
        const statusB = statusOrder[b.testStatus] || 0;
        return sortDirection === "asc" ? statusA - statusB : statusB - statusA;
      }

      if (sortDirection === "asc") {
        return a[sortField]?.toString().localeCompare(b[sortField]?.toString());
      } else {
        return b[sortField]?.toString().localeCompare(a[sortField]?.toString());
      }
    });

    setFilteredStudents(result);
    setPage(0);
  }, [students, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteStudent = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API}/trainer/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(students.filter((student) => student._id !== id));
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleResetTestStatus = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API}/trainer/student/${id}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Student test status reset successfully!");
        fetchStudents(); // Refresh the list
      } else {
        toast.error("Error resetting student test status");
      }
    } catch (error) {
      console.error("Error resetting student test status:", error);
      toast.error("Error resetting student test status");
    } finally {
      setLoading(false);
      setOpenResetDialog(false);
    }
  };

  // Material UI pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dialog handlers
  const openDeleteDialog = (student) => {
    setStudentToDelete(student);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setStudentToDelete(null);
  };

  const openStudentResetDialog = (student) => {
    setStudentToReset(student);
    setOpenResetDialog(true);
  };

  const closeResetDialog = () => {
    setOpenResetDialog(false);
    setStudentToReset(null);
  };

  // Excel export handler
  const exportToExcel = () => {
    try {
      setLoading(true);
      // Format data for excel
      const data = filteredStudents.map((student, index) => {
        return {
          "Sr. No": index + 1,
          Name: student.name || "N/A",
          Email: student.email || "N/A",
          TIN: student.tin || "N/A",
          "Test Score": student.testScore?.total || 0,
          "Part A": student.testScore?.partA || 0,
          "Part B": student.testScore?.partB || 0,
          "Part C": student.testScore?.partC || 0,
          "Part D": student.testScore?.partD || 0,
          "Part E": student.testScore?.partE || 0,
          "Part F": student.testScore?.partF || 0,
          "Test Status": student.testStatus || "N/A",
          "Phone Number": student.phone || "N/A",
          "Alternate ID": student.alternateId || "N/A",
          "Created At": new Date(student.createdAt).toLocaleDateString(),
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const wscols = [
        { wch: 6 }, // Sr. No
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 10 }, // TIN
        { wch: 10 }, // Test Score
        { wch: 8 }, // Part A
        { wch: 8 }, // Part B
        { wch: 8 }, // Part C
        { wch: 8 }, // Part D
        { wch: 8 }, // Part E
        { wch: 8 }, // Part F
        { wch: 12 }, // Test Status
        { wch: 15 }, // Phone Number
        { wch: 15 }, // Alternate ID
        { wch: 12 }, // Created At
      ];
      worksheet["!cols"] = wscols;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "My Students");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      // Get current date for filename
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      // Save file
      saveAs(fileData, `My_Students_${formattedDate}.xlsx`);
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Error exporting data to Excel");
    } finally {
      setLoading(false);
    }
  };

  // Get current students for display
  const currentStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "started":
        return <AccessTimeIcon color="primary" />;
      default:
        return <CancelIcon color="error" />;
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <SwapVertIcon fontSize="small" />;
    return sortDirection === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Students
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Card elevation={3}>
        <CardHeader
          title={
            <Typography
              variant="h6"
              component="h2"
              color="primary"
              fontWeight="bold"
            >
              My Students
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          {/* Search and filter controls */}
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
              label="Search students"
              placeholder="Search by name, email, TIN or score..."
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
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredStudents.length} students
              </Typography>
              <Button
                variant="contained"
                onClick={exportToExcel}
                disabled={loading || filteredStudents.length === 0}
                startIcon={<FileDownloadIcon />}
              >
                {loading ? "Exporting..." : "Export Students"}
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr. N</StyledTableCell>
                  <StyledTableCell>TIN</StyledTableCell>
                  <StyledTableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      Name {getSortIcon("name")}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort("email")}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      Email {getSortIcon("email")}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort("score")}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      Test Score {getSortIcon("score")}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort("testStatus")}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      Test Status {getSortIcon("testStatus")}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Phone Number</StyledTableCell>
                  <StyledTableCell onClick={() => handleSort("createdAt")}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      Created At {getSortIcon("createdAt")}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : currentStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ py: 3 }}
                      >
                        No students found matching your search criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentStudents.map((student, index) => (
                    <StyledTableRow key={student._id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{student.tin}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="score-cell">
                        <ScoreWrapper>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {student.testScore.total}
                            <Tooltip title="View score breakdown">
                              <InfoIcon fontSize="small" color="primary" />
                            </Tooltip>
                          </Box>
                          <ScorePopover>
                            <Typography
                              variant="subtitle2"
                              sx={{ mb: 1, fontWeight: "bold" }}
                            >
                              Individual Scores
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">Part A:</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {student.testScore.partA || 0}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">Part B:</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {student.testScore.partB || 0}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">Part C:</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {student.testScore.partC || 0}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">Part D:</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {student.testScore.partD || 0}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">Part E:</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {student.testScore.partE || 0}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">Part F:</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {student.testScore.partF || 0}
                              </Typography>
                            </Box>
                            <Divider />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                Total:
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {student.testScore.total}
                              </Typography>
                            </Box>
                          </ScorePopover>
                        </ScoreWrapper>
                      </TableCell>
                      <TableCell>
                        {student.testStatus === "completed" ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Completed"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => openStudentResetDialog(student)}
                              disabled={loading}
                            >
                              Reset
                            </Button>
                          </Box>
                        ) : student.testStatus === "started" ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              icon={<AccessTimeIcon />}
                              label="Started"
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => openStudentResetDialog(student)}
                              disabled={loading}
                            >
                              Reset
                            </Button>
                          </Box>
                        ) : (
                          <Chip
                            icon={<CancelIcon />}
                            label="Not Started"
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>{student.phone || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => openDeleteDialog(student)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
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
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {studentToDelete?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteStudent(studentToDelete?._id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset test status dialog */}
      <Dialog open={openResetDialog} onClose={closeResetDialog}>
        <DialogTitle>Reset Test Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the test status for{" "}
            {studentToReset?.name}? This will allow them to take the test again,
            but will erase any current test progress.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResetDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleResetTestStatus(studentToReset?._id)}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerDashboard;
