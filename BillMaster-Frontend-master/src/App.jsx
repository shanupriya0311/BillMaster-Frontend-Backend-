import React, { useState } from "react";
import ProductManagement from "./components/ProductManagement";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./components/Settings";
import Customers from "./components/Customers";
import AddCustomer from "./components/AddCustomer";
import AddEmployee from "./components/AddEmployee";
import AddProductModal from "./components/AddProductModal";
import SalesHistory from "./components/SalesHistory";
import InvoiceModal from "./components/InvoiceModal";
import POS from "./components/POS";
import PaymentModal from "./components/PaymentModal";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import CashierLayout from "./components/CashierLayout";
import ManagerLayout from "./components/ManagerLayout";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import axios from "axios"
import ManagerCustomers from "./components/ManagerCustomers";
// Cashier Imports
import CashierDashboard from "./components/CashierDashboard";
import CashierPOS from "./components/CashierPOS";
import CashierSalesHistory from "./components/CashierSalesHistory";
import CashierCustomer from "./components/CashierCustomer";

import ManagerDashboard from "./components/ManagerDashboard";
import ManagerPOS from "./components/ManagerPOS";
import ManagerProductManagement from "./components/ManagerProductManagement";
import ManagerSalesHistory from "./components/ManagerSalesHistory";
import ManagerReports from "./components/ManagerReports";
import { ToastContainer } from "react-toastify";
function App() {
  const [currentPage, setCurrentPage] = useState("Welcome");
  const [currentUser, setCurrentUser] = useState(null);
  const [userdata, setUserdata] = useState([]);

  const addUser = (newUser) => {
    setUserdata(prev => [...prev, newUser]);
  };

  const handleLogin = (user, targetPage) => {
    setCurrentUser(user);
    setCurrentPage(targetPage);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("Welcome");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <Home onNavigate={setCurrentPage} />;
      case "Dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "POS":
        return <POS />;
      case "Products":
        return <ProductManagement />;
      case "Sales History":
        return <SalesHistory />;
      case "Reports":
        return <Reports />;
      case "Customers":
        return <Customers />;
      case "Settings":
        return <Settings />;
      case "AddEmployee":
        return <AddEmployee userdata={userdata} addUser={addUser} />;

      // Cashier Routes
      case "CashierDashboard":
        return <CashierDashboard />;
      case "CashierPOS":
        return <CashierPOS onNavigate={setCurrentPage} />;
      case "CashierSalesHistory":
        return <CashierSalesHistory onNavigate={setCurrentPage} />;
      case "CashierCustomer":
        return <CashierCustomer />;

      // Manager Routes
      case "ManagerDashboard":
        return <ManagerDashboard />;
      case "ManagerPOS":
        return <ManagerPOS onNavigate={setCurrentPage} />;
      case "ManagerProductManagement":
        return <ManagerProductManagement />;
      case "ManagerSalesHistory":
        return <ManagerSalesHistory onNavigate={setCurrentPage} />;
      case "ManagerReports":
        return <ManagerReports />;
      case "ManagerCustomers":
        return <ManagerCustomers onNavigate={setCurrentPage} />;


      default:
        return <Dashboard />;
    }
  };

  const isCashierPage = ["CashierDashboard", "CashierPOS", "CashierSalesHistory", "CashierCustomer"].includes(currentPage);
  const isManagerPage = ["ManagerDashboard", "ManagerPOS", "ManagerProductManagement", "ManagerSalesHistory", "ManagerReports", "ManagerCustomers"].includes(currentPage);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
      />
      {currentPage === "Welcome" ? (
        <Welcome onNavigate={setCurrentPage} />
      ) : currentPage === "Home" ? (
        <Home onLogin={handleLogin} onNavigate={setCurrentPage} userdata={userdata} />
      ) : currentPage === "SignUp" ? (
        <SignUp onNavigate={setCurrentPage} />
      ) : currentPage === "ResetPassword" ? (
        <ResetPassword onNavigate={setCurrentPage} />
      ) : currentPage === "ForgotPassword" ? (
        <ForgotPassword onNavigate={setCurrentPage} />
      ) : isCashierPage ? (
        <CashierLayout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout}>
          {renderPage()}
        </CashierLayout>
      ) : isManagerPage ? (
        <ManagerLayout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout}>
          {renderPage()}
        </ManagerLayout>
      ) : (
        <Layout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout}>
          {renderPage()}
        </Layout>
      )}
    </>
  );
}

export default App;
