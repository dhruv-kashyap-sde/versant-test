import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AllStudent.css'

const AllStudent = () => {
  const [students, setStudents] = useState([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/admin/students`)
      .then(response => {
        setStudents(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error)
      })
  }, [])

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
            <th>Phone Number</th>
            <th>Alternate ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{index + 1}</td>
              <td>{student.tin}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.testScore}</td>
              <td>{student.phone}</td>
              <td>{student.alternateId === "" ? "N/A" :student.alternateId}</td>
              <td>{new Date(student.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AllStudent