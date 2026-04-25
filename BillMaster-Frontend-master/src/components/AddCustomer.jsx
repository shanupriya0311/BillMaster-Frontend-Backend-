import React, { useState } from "react";
import axios from "axios";
import "./AddCustomer.css";
import {toast} from "react-toastify"
const AddCustomer = ({ onClose, onAdd }) => {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending:", formData); 

    try {
      const response = await axios.post(
        "http://localhost:8085/api/customers",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Customer added:", response.data);
      toast.success("Customer Added Successfully");

      onAdd(response.data);

      onClose();

    } catch (error) {
      console.error("Customer not added:", error);
      
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2 className="modal-title">Add New Customer</h2>

        <form onSubmit={handleSubmit}>

          <div className="field">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Address</label>
            <input
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="add-btn">
              Add Customer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
