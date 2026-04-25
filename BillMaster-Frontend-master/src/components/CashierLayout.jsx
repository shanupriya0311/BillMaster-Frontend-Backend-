import React from "react";
import CashierSidebar from "./CashierSidebar";
import "./SalesHistory.css";

const CashierLayout = ({ currentPage, onNavigate, currentUser, onLogout, children }) => {
    return (
        <div className="app">
            <CashierSidebar activePage={currentPage} onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />
            {children}
        </div>
    );
};

export default CashierLayout;
