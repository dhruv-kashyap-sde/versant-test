import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../../utils/Loaders/Loader";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import StudentDetails from './StudentDetails';

// Material UI imports
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, 
  Paper, Typography, TextField, InputAdornment, IconButton, Button, 
  Box, Chip, Tooltip, Card, CardContent, CardHeader, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { 
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon, 
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  SwapVert as SwapVertIcon,
  Info as InfoIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Custom styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main, // Changed from .light to .main
  color: theme.palette.common.white,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Changed hover to use primary.dark
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const ScorePopover = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '250px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(2),
  zIndex: 1,
  display: 'none',
  '& .MuiDivider-root': {
    margin: theme.spacing(1, 0),
  },
  '.score-cell:hover &': {
    display: 'block',
  },
}));

const ScoreWrapper = styled(Box)({
  position: 'relative',
  cursor: 'pointer',
});

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Pagination state (Material UI style)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Delete confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Add these state variables for student details dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    axios
      .get(`${import.meta.env.VITE_API}/admin/students`)
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoadingStudents(false);
      })
      .catch((error) => {
        setLoadingStudents(false);
        toast.error("Error fetching students");
        console.error("There was an error fetching the students!", error);
      });
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
        student => 
          student.name.toLowerCase().includes(lowerCaseSearch) ||
          student.email.toLowerCase().includes(lowerCaseSearch) ||
          student.testScore.total.toString().includes(searchTerm)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortField === 'score') {
        if (sortDirection === 'asc') {
          return a.testScore.total - b.testScore.total;
        } else {
          return b.testScore.total - a.testScore.total;
        }
      }

      if (sortField === 'createdAt') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (sortField === 'testStatus') {
        const statusOrder = { "completed": 2, "started": 1, "not-started": 0 };
        const statusA = statusOrder[a.testStatus] || 0;
        const statusB = statusOrder[b.testStatus] || 0;
        return sortDirection === 'asc' ? statusA - statusB : statusB - statusA;
      }

      if (sortDirection === 'asc') {
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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteStudent = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API}/admin/student/${id}`);
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

  const handleAllowance = async (id) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/admin/student/${id}/reset`
      );
      if (response.status === 200) {
        toast.success("Student allowed to take the test!");
      } else {
        toast.error("Error allowing student to take the test");
      }
    } catch (error) {
      console.error("Error allowing student:", error);
      toast.error("Error allowing student to take the test");
    } finally {
      setLoading(false);
      fetchStudents();
    }
  };

  const getStudentDetails = async (id) => {
    setLoadingDetails(true);
    setOpenDetailsDialog(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/admin/details/${id}`);
      if (response.status === 200) {
        console.log("Student details response:", response.data);
        
        setStudentDetails(response.data);
      } else {
        toast.error("Error fetching student details");
      }
    } catch (error) {
      console.log("Error fetching student details:", error);
      toast.error(`${error.response?.data?.error || "Failed to fetch student details"}`);
      setOpenDetailsDialog(false);
    } finally {
      setLoadingDetails(false);
    }
  }

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
  
  // Excel export handler
  const exportToExcel = () => {
    try {
      setLoading(true);
      // Format data for excel
      const data = filteredStudents.map((student, index) => {
        return {
          'Sr. No': index + 1,
          'Name': student.name || 'N/A',
          'Email': student.email || 'N/A',
          'TIN': student.tin || 'N/A',
          'Test Score': student.testScore?.total || 0,
          'Part A': student.testScore?.partA || 0,
          'Part B': student.testScore?.partB || 0,
          'Part C': student.testScore?.partC || 0,
          'Part D': student.testScore?.partD || 0,
          'Part E': student.testScore?.partE || 0,
          'Part F': student.testScore?.partF || 0,
          'Test Status': student.testStatus || 'N/A',
          'Phone Number': student.phone || 'N/A',
          'Alternate ID': student.alternateId || 'N/A',
          'Created By': student.createdBy || 'Admin',
          'Created At': new Date(student.createdAt).toLocaleDateString()
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
      worksheet['!cols'] = wscols;
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
      // Get current date for filename
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      // Save file
      saveAs(fileData, `Students_${formattedDate}.xlsx`);
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
    switch(status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'started':
        return <AccessTimeIcon color="primary" />;
      default:
        return <CancelIcon color="error" />;
    }
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <SwapVertIcon fontSize="small" />;
    return sortDirection === 'asc' ? 
      <ArrowUpwardIcon fontSize="small" /> : 
      <ArrowDownwardIcon fontSize="small" />;
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Card elevation={3}>
        <CardHeader 
          title={
            <Typography variant="h5" component="h1" color="primary" fontWeight="bold">
              All Students
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          {/* Search and filter controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: 'wrap', 
            gap: 2 
          }}>
            <TextField
              label="Search students"
              placeholder="Search by name, email or score..."
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                  <StyledTableCell onClick={() => handleSort('name')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5  }}>
                      Name {getSortIcon('name')}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('email')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Email {getSortIcon('email')}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('score')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Test Score {getSortIcon('score')}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('testStatus')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Test Status {getSortIcon('testStatus')}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Phone Number</StyledTableCell>
                  {/* <StyledTableCell>Alternate ID</StyledTableCell> //commenting because alternate id doesnt have that much of a use  */}
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Created By
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('createdAt')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Created At {getSortIcon('createdAt')}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : currentStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {student.testScore.total}
                            <Tooltip title="View score breakdown">
                              <InfoIcon fontSize="small" color="primary" />
                            </Tooltip>
                          </Box>
                          <ScorePopover>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              Individual Scores
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Part A:</Typography>
                              <Typography variant="body2" fontWeight="medium">{student.testScore.partA || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Part B:</Typography>
                              <Typography variant="body2" fontWeight="medium">{student.testScore.partB || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Part C:</Typography>
                              <Typography variant="body2" fontWeight="medium">{student.testScore.partC || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Part D:</Typography>
                              <Typography variant="body2" fontWeight="medium">{student.testScore.partD || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Part E:</Typography>
                              <Typography variant="body2" fontWeight="medium">{student.testScore.partE || 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Part F:</Typography>
                              <Typography variant="body2" fontWeight="medium">{student.testScore.partF || 0}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2" fontWeight="bold">Total:</Typography>
                              <Typography variant="body2" fontWeight="bold">{student.testScore.total}</Typography>
                            </Box>
                          </ScorePopover>
                        </ScoreWrapper>
                      </TableCell>
                      <TableCell>
                        {student.testStatus === "completed" ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
                              onClick={() => handleAllowance(student._id)}
                              disabled={loading}
                            >
                              {loading ? "Please wait..." : "Allow"}
                            </Button>
                          </Box>
                        ) : student.testStatus === "started" ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
                              onClick={() => handleAllowance(student._id)}
                              disabled={loading}
                            >
                              {loading ? "Please wait..." : "Allow"}
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
                        {student.createdBy ?? "Admin" }
                      </TableCell>
                      <TableCell>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => openDeleteDialog(student)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                        <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => getStudentDetails(student._id)}
                        >
                          Get Details
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
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
      <Dialog
        open={openDialog}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
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

      {/* Student Details Dialog */}
      <StudentDetails 
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        data={studentDetails}
        loading={loadingDetails}
      />
    </Box>
  );
};

export default AllStudent;