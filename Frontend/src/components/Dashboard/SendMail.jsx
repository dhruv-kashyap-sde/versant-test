import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../utils/Loaders/Loader";

// Material UI imports
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Mail as MailIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SendMail = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // State for pagination and searching
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // State for email functionality
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  // Effect to handle filtering
  useEffect(() => {
    let result = students;
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = students.filter(
        student => 
          student.name.toLowerCase().includes(lowerCaseSearch) ||
          student.email.toLowerCase().includes(lowerCaseSearch) ||
          student.tin.toString().includes(searchTerm)
      );
    }
    setFilteredStudents(result);
    setPage(0);
  }, [students, searchTerm]);

  // Get current students
  const currentStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // Effect to handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedStudents(currentStudents.map(student => student._id));
    } else if (selectAll === false) {
      // Only clear when selectAll is explicitly set to false, not on every currentStudents change
      setSelectedStudents([]);
    }
  }, [selectAll]);
  // Handle student selection
  const handleSelectStudent = (id) => {
    // Create a new array for selections to avoid state mutation issues
    let newSelectedStudents;
    
    if (selectedStudents.includes(id)) {
      // If student is already selected, remove them
      newSelectedStudents = selectedStudents.filter(studentId => studentId !== id);
      // If we're deselecting any student, "select all" should be false
      setSelectAll(false);
    } else {
      // If student is not selected, add them
      newSelectedStudents = [...selectedStudents, id];
      
      // If all students are now selected, set selectAll to true
      if (newSelectedStudents.length === currentStudents.length) {
        setSelectAll(true);
      }
    }
    
    setSelectedStudents(newSelectedStudents);
  };
  // Handle selectAll change
  const handleSelectAllClick = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    
    if (checked) {
      // If checking "select all", add all current student IDs to selection
      setSelectedStudents(currentStudents.map(student => student._id));
    } else {
      // If unchecking "select all", clear selections
      setSelectedStudents([]);
    }
  };
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Update "select all" state based on whether all items on the new page are selected
    const newPageStudents = filteredStudents.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    );
    
    const allNewPageStudentsSelected = newPageStudents.every(
      student => selectedStudents.includes(student._id)
    );
    
    setSelectAll(allNewPageStudentsSelected && newPageStudents.length > 0);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    
    // Update "select all" state for the first page with new row count
    const newPageStudents = filteredStudents.slice(0, newRowsPerPage);
    
    const allNewPageStudentsSelected = newPageStudents.every(
      student => selectedStudents.includes(student._id)
    );
    
    setSelectAll(allNewPageStudentsSelected && newPageStudents.length > 0);
  };

  // Send email to selected students
  const sendInvitationEmails = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setSendingEmail(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/admin/send-invitations`,
        {
          studentIds: selectedStudents
        }
      );

      if (response.status === 200) {
        toast.success(`Invitations sent to ${selectedStudents.length} students`);
        setSelectedStudents([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Box sx={{ p: 0 }}>
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
              placeholder="Search by name, email or TIN..."
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
            
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MailIcon />}
                onClick={sendInvitationEmails}
                disabled={selectedStudents.length === 0 || sendingEmail}
                sx={{ height: 40 }}
              >
                {sendingEmail 
                  ? "Sending Invitations..." 
                  : `Send TIN Invitation (${selectedStudents.length})`}
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selectedStudents.length > 0 && selectedStudents.length < currentStudents.length}
                      checked={currentStudents.length > 0 && selectedStudents.length === currentStudents.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sr. N</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>TIN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : currentStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                        No students found matching your search criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentStudents.map((student, index) => {
                    const isSelected = selectedStudents.includes(student._id);
                    return (
                      <TableRow 
                        key={student._id} 
                        hover
                        selected={isSelected}
                        sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            onChange={() => handleSelectStudent(student._id)}
                          />
                        </TableCell>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.tin}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SendMail;