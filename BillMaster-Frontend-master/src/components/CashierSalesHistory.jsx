import React, { useEffect, useState } from "react";
import "./SalesHistory.css";
import InvoiceModal from "./InvoiceModal";
import axios from "axios";
function SalesHistory({ onNavigate }) {
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
   const [salesData, setSalesData] = useState([]);
const handleViewInvoice = async (invoiceNumber) => {
  try {
    const response = await axios.get(
      `http://localhost:8087/api/payment/history/invoice/${invoiceNumber}`
    );
     console.log("INVOICE RESPONSE:", response.data);
    setSelectedInvoice(response.data[0]);
    setShowInvoice(true);
  } catch (error) {
    console.log("Error fetching invoice details", error);
    alert("Failed to load invoice details.");
  }
};
useEffect(() => {
  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:8087/api/payment/history");
      setSalesData(response.data);
    } catch (error) {
      console.log("Error fetching sales data", error);
    }
  };

  fetchSales();
}, []);


  const handleClose = () => {
    setShowInvoice(false);
    setSelectedInvoice(null);
  };

  const parseDate = (dateStr) => {
    return new Date(dateStr);
  };

const filteredSales = salesData.filter((tx) => {

  const invoice = String(tx.invoiceNumber || "");
  const customer = String(tx.customerName || "");

  const matchesSearch =
    invoice.startsWith(searchTerm) ||
    customer.toLowerCase().includes(searchTerm.toLowerCase());

  if (!matchesSearch) return false;

  if (startDate || endDate) {
    const txDate = new Date(Date.parse(tx.date));

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      if (txDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23,59,59,999);
      if (txDate > end) return false;
    }
  }

  return true;
});

  return (
    <>
      <main className="main-content" style={{ padding: "24px", background: "#f8fafc", height: "100%", overflowY: "auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "4px" }}>Sales History</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>{filteredSales.length} transactions</p>
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", background: "#fff", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8" }}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", width: "100%", fontSize: "14px", color: "#0f172a" }}
            />
          </div>

        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredSales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              <p>No transactions found matching your search.</p>
            </div>
          ) : (
            filteredSales.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "white",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#ecfdf5",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "16px" }}>{tx.id}</div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{tx.date}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "18px" }}>{tx.amount}</div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
                      {tx.meta} 
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewInvoice(tx.invoiceNumber)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "none",
                      background: "#f1f5f9",
                      color: "#475569",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  >
                    <i className="far fa-eye"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {
        showInvoice && selectedInvoice && (
          <InvoiceModal invoice={selectedInvoice} onClose={() => setShowInvoice(false)} />
        )
      }
    </>
  );
}

export default SalesHistory;
