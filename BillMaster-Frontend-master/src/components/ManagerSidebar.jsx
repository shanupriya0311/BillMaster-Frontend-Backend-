import React from "react";
import "./SalesHistory.css";

const ManagerSidebar = ({ activePage, onNavigate, currentUser, onLogout }) => {

    const userName = currentUser?.name || "Manager";
    const userRole = currentUser?.role || "manager";
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
                <a onClick={() => onNavigate("ManagerDashboard")} className={`nav-item ${activePage === "ManagerDashboard" ? "active" : ""}`}>
                    <i className="fas fa-th-large"></i> Dashboard
                </a>
                <a onClick={() => onNavigate("ManagerPOS")} className={`nav-item ${activePage === "ManagerPOS" ? "active" : ""}`}>
                    <i className="fas fa-shopping-cart"></i> Point of Sale
                </a>
                <a onClick={() => onNavigate("ManagerProductManagement")} className={`nav-item ${activePage === "ManagerProductManagement" ? "active" : ""}`}>
                    <i className="fas fa-box"></i> Products
                </a>
                <a onClick={() => onNavigate("ManagerSalesHistory")} className={`nav-item ${activePage === "ManagerSalesHistory" ? "active" : ""}`}>
                    <i className="fas fa-file-invoice-dollar"></i> Sales History
                </a>
                <a onClick={() => onNavigate("ManagerReports")} className={`nav-item ${activePage === "ManagerReports" ? "active" : ""}`}>
                    <i className="fas fa-chart-bar"></i> Reports
                </a>
                <a onClick={() => onNavigate("ManagerCustomers")} className={`nav-item ${activePage === "ManagerCustomers" ? "active" : ""}`}>
                    <i className="fas fa-users"></i> Customers
                </a>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">{userInitial}</div>
                    <div>

                        <div className="user-role" style={{ paddingLeft: "0px" }}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                    </div>
                </div>
                <button className="logout-btn" style={{ paddingLeft: "0px" }} onClick={onLogout}>
                    <i className="fas fa-arrow-right-from-bracket"></i> Logout
                </button>
            </div>
        </aside>
    );
};

export default ManagerSidebar;
