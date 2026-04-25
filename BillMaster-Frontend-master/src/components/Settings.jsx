import React, { useState } from "react";
import "./Settings.css";

function Settings({ onNavigate }) {
  const [editCard, setEditCard] = useState(null);

  const [store, setStore] = useState({
    name: "BillMaster Store",
    address: "123 Main Street, City",
    phone: "+91 98765 43210",
    gstin: "29ABCDE1234F1Z5",
  });

  const [tax, setTax] = useState({
    cgst: "9",
    sgst: "9",
    category: "Standard (18%)",
  });

  const [invoice, setInvoice] = useState({
    prefix: "BM",
    start: "10000",
  });

  const autoSave = (section, data) => {
    console.log(`Saved ${section}`, data);
  };

  return (
    <main className="main-content">
      <div className="top-bar">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="icon">🏪</div>
              <div>
                <h3>Store Information</h3>
                <p>Basic store details</p>
              </div>
            </div>
            <span className="edit-icon" onClick={() => setEditCard("store")}>
              ✏️
            </span>
          </div>

          <label>Store Name</label>
          <input
            value={store.name}
            readOnly={editCard !== "store"}
            onChange={(e) => setStore({ ...store, name: e.target.value })}
            onBlur={() => autoSave("store", store)}
          />

          <label>Address</label>
          <input
            value={store.address}
            readOnly={editCard !== "store"}
            onChange={(e) => setStore({ ...store, address: e.target.value })}
            onBlur={() => autoSave("store", store)}
          />

          <div className="row">
            <div>
              <label>Phone</label>
              <input
                value={store.phone}
                readOnly={editCard !== "store"}
                onChange={(e) =>
                  setStore({ ...store, phone: e.target.value })
                }
                onBlur={() => autoSave("store", store)}
              />
            </div>
            <div>
              <label>GSTIN</label>
              <input
                value={store.gstin}
                readOnly={editCard !== "store"}
                onChange={(e) =>
                  setStore({ ...store, gstin: e.target.value })
                }
                onBlur={() => autoSave("store", store)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="icon">%</div>
              <div>
                <h3>Tax Configuration</h3>
                <p>GST/VAT settings</p>
              </div>
            </div>
            <span className="edit-icon" onClick={() => setEditCard("tax")}>
              ✏️
            </span>
          </div>

          <div className="row">
            <div>
              <label>Tax Rate 1 (CGST)</label>
              <input
                value={tax.cgst}
                readOnly={editCard !== "tax"}
                onChange={(e) => setTax({ ...tax, cgst: e.target.value })}
                onBlur={() => autoSave("tax", tax)}
              />
            </div>
            <div>
              <label>Tax Rate 2 (SGST)</label>
              <input
                value={tax.sgst}
                readOnly={editCard !== "tax"}
                onChange={(e) => setTax({ ...tax, sgst: e.target.value })}
                onBlur={() => autoSave("tax", tax)}
              />
            </div>
          </div>

          <label>Default Tax Category</label>
          <input
            value={tax.category}
            readOnly={editCard !== "tax"}
            onChange={(e) =>
              setTax({ ...tax, category: e.target.value })
            }
            onBlur={() => autoSave("tax", tax)}
          />
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="icon">🧾</div>
              <div>
                <h3>Invoice Settings</h3>
                <p>Customize invoices</p>
              </div>
            </div>
            <span className="edit-icon" onClick={() => setEditCard("invoice")}>
              ✏️
            </span>
          </div>

          <label>Invoice Prefix</label>
          <input
            value={invoice.prefix}
            readOnly={editCard !== "invoice"}
            onChange={(e) =>
              setInvoice({ ...invoice, prefix: e.target.value })
            }
            onBlur={() => autoSave("invoice", invoice)}
          />

          <label>Starting Number</label>
          <input
            value={invoice.start}
            readOnly={editCard !== "invoice"}
            onChange={(e) =>
              setInvoice({ ...invoice, start: e.target.value })
            }
            onBlur={() => autoSave("invoice", invoice)}
          />
        </div>
      </div>
      <div className="settings-actions">
        <button className="save-btn">Save</button>
      </div>

    </main >
  );
}

export default Settings;
