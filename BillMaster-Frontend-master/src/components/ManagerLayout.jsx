import React from "react";
import ManagerSidebar from "./ManagerSidebar";
import "./SalesHistory.css";

const ManagerLayout = ({ currentPage, onNavigate, currentUser, onLogout, children }) => {
    return (
        <div className="app">
            <ManagerSidebar activePage={currentPage} onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />
            {/* Start Main Content Wrapper */}
            {children}
            {/* End Main Content Wrapper */}
        </div>
    );
};

export default ManagerLayout;
