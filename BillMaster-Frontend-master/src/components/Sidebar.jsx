import React from "react";
import "./SalesHistory.css";

const Sidebar = ({ activePage, onNavigate, currentUser, onLogout }) => {

    const userName = currentUser?.name || "Admin";
    const userRole = currentUser?.role || "admin";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo-box">
                    <i className="fas fa-store"></i>
                </div>
                <div className="brand-text">
                    <span className="sidebar-brand-name">BillMaster</span>
                    <span className="brand-sub">Point of Sale</span>
                </div>
            </div>

            <nav className="nav-menu">
                <a onClick={() => onNavigate("Dashboard")} className={`nav-item ${activePage === "Dashboard" ? "active" : ""}`}><i className="fas fa-th-large"></i> Dashboard</a>
                <a onClick={() => onNavigate("POS")} className={`nav-item ${activePage === "POS" ? "active" : ""}`}><i className="fas fa-shopping-cart"></i> Point of Sale</a>
                <a onClick={() => onNavigate("Products")} className={`nav-item ${activePage === "Products" ? "active" : ""}`}><i className="fas fa-box"></i> Products</a>
                <a onClick={() => onNavigate("Sales History")} className={`nav-item ${activePage === "Sales History" ? "active" : ""}`}><i className="fas fa-file-invoice-dollar"></i> Sales History</a>
                <a onClick={() => onNavigate("Reports")} className={`nav-item ${activePage === "Reports" ? "active" : ""}`}><i className="fas fa-chart-line"></i> Reports</a>
                <a onClick={() => onNavigate("Customers")} className={`nav-item ${activePage === "Customers" ? "active" : ""}`}><i className="fas fa-users"></i> Customers</a>
                <a onClick={() => onNavigate("AddEmployee")} className={`nav-item ${activePage === "AddEmployee" ? "active" : ""}`}><i className="fas fa-user-plus"></i> Add Employee</a>
                <a onClick={() => onNavigate("Settings")} className={`nav-item ${activePage === "Settings" ? "active" : ""}`}><i className="fas fa-cog"></i> Settings</a>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">{userInitial}</div>
                    <div>
                        <div className="user-role" style={{ paddingLeft: "0px" }}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                    </div>
                </div>
                <button className="logout-btn" onClick={onLogout}>
                    <i className="fas fa-arrow-right-from-bracket"></i> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
