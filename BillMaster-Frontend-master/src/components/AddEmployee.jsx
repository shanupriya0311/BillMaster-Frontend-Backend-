import React, { useState } from 'react';
import './AddEmployee.css';
import axios from 'axios';

const AddEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addnewemployee = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8083/api/auth/register", formData);
      console.log("Employee added successfully:", response.data);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: Date.now(),
      name: formData.username,
      email: formData.email,
      role: formData.role,
      status: "active"
    };
    setEmployees(prev => [...prev, newEmployee]);
    addnewemployee(formData);
    setFormData({ username: "", email: "", password: "", role: "", phone: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };
  const toggleStatus = (id) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id ? { ...emp, status: emp.status === "active" ? "inactive" : "active" } : emp
    ));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{width:"100%", padding: "20px" }}>
      <div  className="page-header">
        <div>
        <h1>Employees</h1>
        <p>Manage your team members and their access</p>
        </div>
        <button className="btn-add-employee" onClick={() => setShowModal(true)}>Add Employee</button>
      </div>
      <div className="search-filter-bar">
    <div className="search-box">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
</div>
      <div className="employee-count">
        {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
      </div>
</div>
<div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>
                <div className="employee-info">
                  <div className="employee-avatar">
                  {emp.name.charAt(0).toUpperCase()}
                  </div>
                <div>
                  <div className="employee-name">{emp.name}</div>
                  <div className="employee-email">{emp.email}</div>
                </div>
                </div>
              </td>
                          <td>
                <span className={`role-badge ${emp.role === "ROLE_CASHIER"
                  ? "role-cashier"
                  : emp.role === "ROLE_MANAGER"
                    ? "role-manager"
                    : "role-admin"}`}>
                  {emp.role.replace("ROLE_", "")}
                </span>
              </td>

              <td>
                <span
                  onClick={() => toggleStatus(emp.id)}
                  className={`status-badge ${emp.status === "active" ? "status-active" : "status-inactive"}`}
                >
                  {emp.status}
                </span>
              </td>

              <td>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(emp.id)}
                >
                  🗑
                </button>
              </td>
            
            </tr>
          ))}
        </tbody>
      </table>

      {filteredEmployees.length === 0 && (
       <div className="empty-state">
          <p>No employees found</p>
        </div>

      )}
</div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div  className="modal-content"onClick={(e) => e.stopPropagation()}>
             <div className="modal-header">
            <h2 style={{color:'green',fontSize:"35px",fontFamily:"Arial, sans-serif"}}>Add New Employee</h2>
            <button className="modal-close" onClick={() => setShowModal(false)}>X</button>
          </div>
            <form className="employee-form" onSubmit={handleSubmit}>
              
            <div className="form-group">

              <label>Full Name</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
</div>
<div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
</div>
<div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
</div>
<div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select role</option>
                <option value="ROLE_CASHIER">Cashier</option>
                <option value="ROLE_MANAGER">Manager</option>
              </select>
</div>
<div className="form-actions">
              <button type="button" style={{marginLeft:"50px",marginRight:"50px"}} className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-submit">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;