import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AllStudent.css'
import toast from 'react-hot-toast'

const AllStudent = () => {
  const [students, setStudents] = useState([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/admin/students`)
      .then(response => {
        console.log(response.data);
        
        setStudents(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error)
      })
  }, [])

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/admin/student/${id}`)
      setStudents(students.filter(student => student._id !== id))
      toast.success('Student deleted successfully!')
    } catch (error) {
      console.error('Error deleting student:', error)
      toast.error('Error deleting student');
    }
  }
  return (
    <>
      <div className="header">
        <h1 className="color">All Students</h1>
      </div>
      <div className='hr'></div>
      <table className="student-table">
        <thead>
          <tr>
            <th>Sr. N</th>
            <th>TIN</th>
            <th>Name</th>
            <th>Email</th>
            <th>Test Score</th>
            <th>Test Status</th>
            <th>Phone Number</th>
            <th>Alternate ID</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{index + 1}</td>
              <td>{student.tin}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.testScore.total}</td>
              <td>
                {student.testStatus === "completed" ? (
                  <span className='completed'><i className="ri-check-line green"></i> Completed</span>
                ) : student.testStatus === "started" ? (
                  <span className='started'>Started</span>
                ) : (
                  <span className='not-started'><i className="ri-close-line red"></i> Not Started</span>
                )
                }
                </td>
              <td>{student.phone}</td>
              <td>{student.alternateId === "" ? "N/A" : student.alternateId}</td>
              <td>{new Date(student.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDeleteStudent(student._id)} className="delete-btn"><i className="ri-delete-bin-6-line"></i>Delete</button>&nbsp;
                {/* <button className="edit-btn"><i className="ri-pencil-line"></i>Edit</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AllStudent