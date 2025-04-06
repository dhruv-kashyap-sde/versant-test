import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    // console.log(file);
    
    // Check file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get the token from localStorage (assuming you store it there after login)
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API}/admin/students/import`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="excel-upload-container">
      <h2>Import Students from Excel</h2>
      
      <div className="excel-format-info">
        <h3>Excel File Format Guide:</h3>
        <p>Your Excel file should have the following columns:</p>
        <ul>
          <li><strong>name</strong> - Student's full name (required)</li>
          <li><strong>email</strong> - Student's email address (required)</li>
          <li><strong>phone</strong> - Student's phone number (required)</li>
          <li><strong>alternateId</strong> - Any alternate identification (optional)</li>
        </ul>
        <p>Example:</p>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
              <th>phone</th>
              <th>alternateId</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>1234567890</td>
              <td>STU001</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>9876543210</td>
              <td>STU002</td>
            </tr>
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="excel-file">Select Excel File:</label>
          <input 
            type="file" 
            id="excel-file" 
            onChange={handleFileChange} 
            accept=".xlsx, .xls" 
          />
        </div>
        
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-container">
          <h3>Import Results</h3>
          <p>{result.message}</p>
          
          {result.success && result.success.length > 0 && (
            <div>
              <h4>Successfully Imported ({result.success.length}):</h4>
              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>TIN</th>
                  </tr>
                </thead>
                <tbody>
                  {result.success.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.tin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {result.errors && result.errors.length > 0 && (
            <div>
              <h4>Failed Entries ({result.errors.length}):</h4>
              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((error, index) => (
                    <tr key={index}>
                      <td>{JSON.stringify(error.row)}</td>
                      <td>{error.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
