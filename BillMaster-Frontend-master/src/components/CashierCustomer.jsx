import React, { useEffect, useState } from "react";
import "./Customers.css";
import AddCustomer from "./AddCustomer";
import deleteIcon from "../assets/delete.png";
import axios from "axios";
import {toast} from "react-toastify";
import "./toast.css";
/* =======================
   Customer Card Component
   ======================= */

const CustomerCard = ({ customer, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="customer-avatar">👤</div>

        <div className="info">
          <h3>{customer.name}</h3>
          <p>📞 {customer.phone}</p>
          {customer.email && <p>📧 {customer.email}</p>}
        </div>
      </div>

      <div className="card-stats">
        <span>{customer.total}</span>
      </div>

      <img
        src={deleteIcon}
        alt="Delete"
        className="delete-icon"
        onClick={() => onDelete(customer.phone)}
      />
    </div>
  );
};

/* =======================
   Main Component
   ======================= */

const CashierCustomer = () => {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
const [selectedPhone, setSelectedPhone] = useState(null);

const confirmDelete = (phone) => {
  setSelectedPhone(phone);

  toast(
    ({ closeToast }) => (
      <div className="toast-box">
        <p>Are you sure you want to delete?</p>

        <div className="toast-actions">
          <button
            className="yes-btn"
            onClick={() => {
              handleDelete(phone);
              closeToast();
            }}
          >
            Yes
          </button>

          <button className="no-btn" onClick={closeToast}>
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      hideProgressBar: true,
    }
  );
};
  const handleDelete=async(phone)=>{
      try{
        await axios.delete(`http://localhost:8085/api/customers/phone/${phone}`);
         setCustomers(prev => prev.filter(c => c.phone !== phone));
        console.log("customer deleted successfully");

        toast.error("Customer deleted Successfully");
      }
      catch(error){
        console.log("customer not found");
      }    
    };
  // FETCH CUSTOMERS
  useEffect(() => {

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
       "http://localhost:8085/api/customers"
        );

        setCustomers(response.data); // ✅ store all backend data
        console.log("Customers loaded successfully");

      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomer();

  }, []);

  // SEARCH FILTER
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  // ADD CUSTOMER
  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  // DELETE CUSTOMER
  /*const handleDelete = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };*/

  return (
    <>
      <main className="main-content">

        <div className="content-header">
          <h1>Customers</h1>

          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Customer
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="customer-grid">
          {filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={confirmDelete}
            />
          ))}
        </div>

      </main>

      {showModal && (
        <AddCustomer
          onAdd={handleAddCustomer}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CashierCustomer;
