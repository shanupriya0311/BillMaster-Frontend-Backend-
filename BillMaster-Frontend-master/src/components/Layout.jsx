import React from "react";
import Sidebar from "./Sidebar";
import "./SalesHistory.css"; // Ensure global layout styles are present

const Layout = ({ currentPage, onNavigate, currentUser, onLogout, children }) => {
    return (
        <div className="app">
            <Sidebar activePage={currentPage} onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />
            {/* Start Main Content Wrapper */}
            {children}
            {/* End Main Content Wrapper */}
        </div>
    );
};

export default Layout;
