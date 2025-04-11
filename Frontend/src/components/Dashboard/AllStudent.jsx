import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllStudent.css";
import toast from "react-hot-toast";
import Loader from "../../utils/Loaders/Loader";

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  // New state variables for pagination, sorting, and search
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

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
    setCurrentPage(1);
  }, [students, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

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

  return (
    <>
      <div className="header">
        <h1 className="color">All Students</h1>
      </div>
      <div className="hr"></div>
      
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email or score..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="ri-search-line search-icon"></i>
        </div>
        
        <div className="pagination-info">
          Showing {filteredStudents.length > 0 ? indexOfFirstStudent + 1 : 0} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
        </div>
      </div>
      
      <table className="student-table">
        <thead>
          <tr>
            <th>Sr. N</th>
            <th>TIN</th>
            <th onClick={() => handleSort('name')} className="sortable-header">
              Name {sortField === 'name' && (sortDirection === 'asc' ? '(A to Z) ' : '(Z to A) ')}<i class="ri-arrow-up-down-line"></i>
            </th>
            <th onClick={() => handleSort('email')} className="sortable-header">
              Email {sortField === 'email' && (sortDirection === 'asc' ? '(A to Z) ' : '(Z to A) ')}<i class="ri-arrow-up-down-line"></i>
            </th>
            <th onClick={() => handleSort('score')} className="sortable-header">
              Test Score {sortField === 'score' && (sortDirection === 'asc' ? '(Low) ' : '(High) ')}<i class="ri-arrow-up-down-line"></i>
            </th>
            <th onClick={() => handleSort('testStatus')} className="sortable-header">
              Test Status {sortField === 'testStatus' && (sortDirection === 'asc' ? '(Not Started) ' : '(Completed) ')}<i class="ri-arrow-up-down-line"></i>
            </th>
            <th>Phone Number</th>
            <th>Alternate ID</th>
            <th onClick={() => handleSort('createdAt')} className="sortable-header">
              Created At {sortField === 'createdAt' && (sortDirection === 'asc' ? '(Old) ' : '(New) ')}<i class="ri-arrow-up-down-line"></i>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={student._id} className={index % 2 === 0 ? "even" : "odd"}>
              <td>{indexOfFirstStudent + index + 1}</td>
              <td>{student.tin}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td className="score-cell">
                <div className="score-wrapper">
                  {student.testScore.total}
                  <div className="score-popup">
                    <div className="score-popup-header">Individual Scores</div>
                    <div className="score-item">
                      <span>Part A:</span>{" "}
                      <span>{student.testScore.partA || 0}</span>
                    </div>
                    <div className="score-item">
                      <span>Part B:</span>{" "}
                      <span>{student.testScore.partB || 0}</span>
                    </div>
                    <div className="score-item">
                      <span>Part C:</span>{" "}
                      <span>{student.testScore.partC || 0}</span>
                    </div>
                    <div className="score-item">
                      <span>Part D:</span>{" "}
                      <span>{student.testScore.partD || 0}</span>
                    </div>
                    <div className="score-item">
                      <span>Part E:</span>{" "}
                      <span>{student.testScore.partE || 0}</span>
                    </div>
                    <div className="score-item">
                      <span>Part F:</span>{" "}
                      <span>{student.testScore.partF || 0}</span>
                    </div>
                    <div className="score-item total">
                      <span>Total:</span> <span>{student.testScore.total}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {student.testStatus === "completed" ? (
                  <span className="status-code">
                    <i className="ri-check-line green">Completed</i>&nbsp;
                    <button
                      onClick={() => handleAllowance(student._id)}
                      className="edit-btn"
                    >
                      {loading ? "Please wait..." : "Allow"}
                    </button>
                  </span>
                ) : student.testStatus === "started" ? (
                  <span className="status-code">
                    <i className="ri-time-line color">Started</i>
                    <button
                      onClick={() => handleAllowance(student._id)}
                      className="edit-btn"
                    >
                      {loading ? "Please wait..." : "Allow"}
                    </button>
                  </span>
                ) : (
                  <span className="status-code">
                    <i className="ri-close-line red">Not Started</i>
                  </span>
                )}
              </td>
              <td>{student.phone}</td>
              <td>
                {student.alternateId === "" ? "N/A" : student.alternateId}
              </td>
              <td>{new Date(student.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDeleteStudent(student._id)}
                  className="delete-btn"
                  disabled={loading}
                >
                  <i className="ri-delete-bin-6-line"></i>
                  {loading ? "Loading..." : "Delete"}
                </button>
                &nbsp;
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredStudents.length === 0 && !loadingStudents && (
        <div className="no-results">No students found matching your search criteria</div>
      )}
      
      {loadingStudents && <Loader />}
      
      {filteredStudents.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            First
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
          <button 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Last
          </button>
        </div>
      )}
    </>
  );
};

export default AllStudent;
