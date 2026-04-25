import React, { useRef } from "react";
import "./InvoiceModal.css";

function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const modalRef = useRef(null);

  const products = invoice.productName
    ? invoice.productName.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  const perItemAmount = products.length > 0
    ? (Number(invoice.amount) / products.length).toFixed(2)
    : Number(invoice.amount).toFixed(2);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=600,height=700");
    if (!printWindow) return;

    const badgeClass = invoice.paymentMethod === "ONLINE" ? "badge-online" : "badge-cash";
    const productsHTML = products.length > 0
      ? products.map(p => `
          <div class="product-row">
            <span class="product-name">${p}</span>
            <span class="product-qty">×1</span>
            <span class="product-price">₹${perItemAmount}</span>
          </div>`).join("")
      : `<div class="product-row">
           <span class="product-name">—</span>
           <span class="product-qty"></span>
           <span class="product-price">₹${Number(invoice.amount).toFixed(2)}</span>
         </div>`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: "Inter", "Segoe UI", sans-serif;
              color: #0f172a;
              background: #fff;
              padding: 40px;
            }

            /* Header */
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 24px;
            }
            .store-info { display: flex; align-items: center; gap: 10px; }
            .store-icon { font-size: 26px; }
            .store-name { font-size: 18px; font-weight: 700; color: #0f172a; }
            .store-sub  { font-size: 12px; color: #64748b; margin-top: 2px; }

            /* Invoice number */
            .inv-number-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
            .inv-number-label {
              font-size: 12px; font-weight: 600; color: #64748b;
              text-transform: uppercase; letter-spacing: 0.05em;
            }
            .inv-number-value {
              font-size: 14px; font-weight: 700; color: #0f172a;
              background: #f1f5f9; padding: 3px 10px;
              border-radius: 6px; font-family: monospace;
            }

            /* Divider */
            .divider { height: 1px; background: #e2e8f0; margin: 16px 0; }

            /* Info rows */
            .info-section { display: flex; flex-direction: column; gap: 10px; }
            .row { display: flex; justify-content: space-between; align-items: center; }
            .label { font-size: 13px; color: #64748b; font-weight: 500; }
            .value { font-size: 13px; font-weight: 600; color: #0f172a; }
            .value-mono { font-family: monospace; font-size: 12px; color: #475569; }

            /* Badge */
            .badge {
              font-size: 11px; font-weight: 700;
              padding: 3px 10px; border-radius: 999px;
              text-transform: uppercase; letter-spacing: 0.04em;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .badge-online {
              background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
            }
            .badge-cash {
              background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;
            }

            /* Products table */
            .products-header {
              display: grid;
              grid-template-columns: 1fr auto auto;
              gap: 12px;
              padding: 6px 0;
              font-size: 11px; font-weight: 700;
              color: #94a3b8; text-transform: uppercase;
              letter-spacing: 0.06em; margin-bottom: 4px;
            }
            .products-header span:not(:first-child) { text-align: right; }
            .products-list { display: flex; flex-direction: column; gap: 4px; }
            .product-row {
              display: grid;
              grid-template-columns: 1fr auto auto;
              gap: 12px; align-items: center;
              padding: 8px 0;
              border-bottom: 1px dashed #f1f5f9;
            }
            .product-row:last-child { border-bottom: none; }
            .product-name { font-size: 14px; font-weight: 500; color: #1e293b; text-transform: capitalize; }
            .product-qty  { font-size: 13px; color: #94a3b8; text-align: right; min-width: 28px; }
            .product-price{ font-size: 14px; font-weight: 600; color: #0f172a; text-align: right; min-width: 70px; }

            /* Total */
            .total-row {
              display: flex; justify-content: space-between;
              align-items: center; padding: 6px 0;
            }
            .total-label { font-size: 15px; font-weight: 700; color: #0f172a; }
            .total-value {
              font-size: 22px; font-weight: 800; color: #0d9488;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Footer note */
            .footer-note {
              text-align: center; margin-top: 32px;
              font-size: 12px; color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="store-info">
              <div class="store-icon">🧾</div>
              <div>
                <div class="store-name">BillMaster</div>
                <div class="store-sub">Sales Invoice</div>
              </div>
            </div>
          </div>

          <!-- Invoice Number -->
          <div class="inv-number-row">
            <span class="inv-number-label">Invoice</span>
            <span class="inv-number-value">${invoice.invoiceNumber}</span>
          </div>

          <div class="divider"></div>

          <!-- Info Rows -->
          <div class="info-section">
            <div class="row">
              <span class="label">Order ID</span>
              <span class="value value-mono">${invoice.orderId || "—"}</span>
            </div>
            <div class="row">
              <span class="label">Cashier</span>
              <span class="value">${invoice.cashierName || "—"}</span>
            </div>
            <div class="row">
              <span class="label">Payment Method</span>
              <span class="badge ${badgeClass}">${invoice.paymentMethod || "—"}</span>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Products -->
          <div class="products-header">
            <span>Item</span><span>Qty</span><span>Amount</span>
          </div>
          <div class="products-list">
            ${productsHTML}
          </div>

          <div class="divider"></div>

          <!-- Total -->
          <div class="total-row">
            <span class="total-label">Total Amount</span>
            <span class="total-value">₹${Number(invoice.amount).toFixed(2)}</span>
          </div>

          <div class="footer-note">Thank you for your purchase!</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="inv-overlay" id="invoice-print-area">
      <div className="inv-modal" ref={modalRef}>

        {/* ── Header ── */}
        <div className="inv-header">
          <div className="inv-store">
            <div className="inv-store-icon">🧾</div>
            <div>
              <div className="inv-store-name">BillMaster</div>
              <div className="inv-store-sub">Sales Invoice</div>
            </div>
          </div>
          <button className="inv-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Invoice Number ── */}
        <div className="inv-number-row">
          <span className="inv-number-label">Invoice</span>
          <span className="inv-number-value">{invoice.invoiceNumber}</span>
        </div>

        <div className="inv-divider" />

        {/* ── Info Rows ── */}
        <div className="inv-info-section">
          <div className="inv-row">
            <span className="inv-label">Order ID</span>
            <span className="inv-value inv-mono">{invoice.orderId || "—"}</span>
          </div>
          <div className="inv-row">
            <span className="inv-label">Cashier</span>
            <span className="inv-value">{invoice.cashierName || "—"}</span>
          </div>
          <div className="inv-row">
            <span className="inv-label">Payment Method</span>
            <span className={`inv-badge ${invoice.paymentMethod === "ONLINE" ? "inv-badge-online" : "inv-badge-cash"}`}>
              {invoice.paymentMethod || "—"}
            </span>
          </div>
        </div>

        <div className="inv-divider" />

        {/* ── Products Table ── */}
        <div className="inv-products-header">
          <span>Item</span>
          <span>Qty</span>
          <span>Amount</span>
        </div>

        <div className="inv-products-list">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="inv-product-row">
                <span className="inv-product-name">{product}</span>
                <span className="inv-product-qty">×1</span>
                <span className="inv-product-price">₹{perItemAmount}</span>
              </div>
            ))
          ) : (
            <div className="inv-product-row">
              <span className="inv-product-name">—</span>
              <span className="inv-product-qty"></span>
              <span className="inv-product-price">₹{Number(invoice.amount).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="inv-divider" />

        {/* ── Total ── */}
        <div className="inv-total-row">
          <span className="inv-total-label">Total Amount</span>
          <span className="inv-total-value">₹{Number(invoice.amount).toFixed(2)}</span>
        </div>

        {/* ── Footer ── */}
        <div className="inv-footer">
          <button className="inv-btn inv-btn-print" onClick={handlePrint}>
            <i className="fas fa-print" /> Print
          </button>
          <button className="inv-btn inv-btn-cancel" onClick={onClose}>
            <i className="fas fa-times" /> Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default InvoiceModal;
