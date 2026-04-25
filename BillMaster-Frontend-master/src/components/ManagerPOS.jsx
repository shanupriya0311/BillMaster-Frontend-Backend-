import React, { useState } from "react";
import "./POS.css";
import PaymentModal from "./PaymentModal";
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import InvoiceModal from "./InvoiceModal";

export default function ManagerPOS() {
  const [cart, setCart] = useState({});
  const [heldCarts, setHeldCarts] = useState([]);
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("All");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [PRODUCTS, setproduct] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const handlePaymentConfirm = (details) => {
    console.log("Payment successful:", details);
    setCart({});
    setIsPaymentModalOpen(false);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:8086/api/products");
      setproduct(response.data);
      console.log(PRODUCTS.data);
    };

    fetchProducts();
  }, []);

  const addToCart = (sku) => {
    const product = PRODUCTS.find(p => p.sku === sku);
    setCart(prev => {
      const c = { ...prev };
      c[sku] ? c[sku].qty++ : (c[sku] = { ...product, qty: 1 });
      return c;
    });
  };

  const changeQty = (sku, val) => {
    setCart(prev => {
      const c = { ...prev };
      c[sku].qty += val;
      if (c[sku].qty <= 0) delete c[sku];
      return c;
    });
  };

  const deleteItem = (sku) => {
    setCart(prev => {
      const c = { ...prev };
      delete c[sku];
      return c;
    });
  };


  const handleHold = () => {
    if (Object.keys(cart).length === 0) return;

    const newHold = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: cart,
      itemCount: Object.values(cart).reduce((s, i) => s + i.qty, 0),
      total: Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0) // Subtotal for info
    };

    setHeldCarts(prev => [newHold, ...prev]);
    setCart({}); // Clear cart
  };

  const restoreHold = (holdId) => {
    const cartToRestore = heldCarts.find(h => h.id === holdId);
    if (cartToRestore) {
      setCart(cartToRestore.items);
      setHeldCarts(prev => prev.filter(h => h.id !== holdId));
    }
  };


  const filtered = PRODUCTS.filter(p => {
    const text = search.toLowerCase().trim();
    const name = String(p.name || "").toLowerCase();
    const sku = String(p.sku || "").toLowerCase();
    const productCategory = String(p.category || "").toLowerCase().trim();
    const selectedCategory = category.toLowerCase().trim();

    const matchSearch = name.startsWith(text) || sku.startsWith(text);

    const matchCategory =
      selectedCategory === "all" ||
      productCategory.includes(selectedCategory) ||
      selectedCategory.includes(productCategory);

    return matchSearch && matchCategory;
  });



  const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const taxRate = 12;
  const tax = subtotal * taxRate / 100;
  const total = subtotal + tax;
  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  const handleBarcode = (e) => {
    if (e.key === "Enter") {
      addToCart(barcode);
      setBarcode("");
    }
  };
  const paymentprocess = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8087/api/payment/create-order?amount=${Math.round(total)}`
      );

      console.log("Order Created:", res.data);

      return res.data;

    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  const handlepay = async () => {
    console.log("PAY CLICKED");
    const data = await paymentprocess();   // STEP 1
    setOrderData(data);

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      order_id: data.orderId,

      handler: async function (response) {

        try {
          const res = await axios.post("http://localhost:8087/api/payment/verify", null, {
            params: {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: total,
              productName: Object.values(cart).map(i => i.name).join(", "),
              paymentMethod: "ONLINE",
              cashierName: "Shanu"
            }
          });
          console.log("VERIFY RESPONSE:", res.data);


          setInvoiceData(res.data);

          setShowInvoice(true);

          setCart({});

        } catch (error) {
          console.log("Payment verify failed:", error);
        }
      }

    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <>

      <main className="main">
        <header className="header">Point of Sale</header>

        <div className="pos">

          <section className="products">
            <div className="search">
              <input
                placeholder="Search by name or SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <input
                placeholder="Scan barcode / Enter SKU"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleBarcode}
              />
            </div>


            <div className="categories">
              {[
                "All",
                "Beverages",
                "Snacks",
                "Dairy",
                "Confectionery",
                "Personal Care",
                "Grocery",
                "Bakery"
              ].map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${category === cat ? "active" : ""}`}
                  onClick={() => {
                    setCategory(cat);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
<div className="grid">
              {filtered.map(p => (
                <div
                  key={p.sku}
                  className="card"
                  onClick={() => addToCart(p.sku)}
                >
                <div className="icon">
  {p.imageUrl ? (
    <img
      src={`http://localhost:8086${p.imageUrl}`}
      alt={p.name}
      style={{ width: "60px", height: "60px", objectFit: "cover" }}
    />
  ) : (
    <img
      src="/boost.jpg"
      alt="no image"
      style={{ width: "60px", height: "60px", objectFit: "cover" }}
    />
  )}
</div>
                  <div className="name">{p.name}</div>
                  <div className="price">₹{p.price}</div>
                  <small>SKU: {p.sku}</small>
                </div>
              ))}
            </div>
            
          </section>


          <aside className="cart">
            <div className="cart-head">
              <span>Current Order</span>
              <span>{count} items</span>
            </div>


            {heldCarts.length > 0 && (
              <div style={{ padding: '0 10px', marginTop: '10px' }}>
                <div
                  style={{
                    backgroundColor: '#fff7ed',
                    border: '1px solid #ffedd5',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c2410c', fontWeight: '600', fontSize: '14px' }}>
                    <PauseCircle size={16} />
                    Held Bills ({heldCarts.length})
                  </div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {heldCarts.map(h => (
                      <button
                        key={h.id}
                        onClick={() => restoreHold(h.id)}
                        style={{
                          flex: '0 0 auto',
                          backgroundColor: 'white',
                          border: '1px solid #fed7aa',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: '#9a3412',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <PlayCircle size={12} />
                        {h.itemCount} items
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="cart-items">
              {Object.values(cart).length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '10px' }}>
                  <div style={{ fontSize: '48px', opacity: 0.2 }}>🛒</div>
                  <p>No items in cart</p>
                  <small>Scan or search products to add</small>
                </div>
              ) : (
                Object.values(cart).map(item => (
                  <div className="cart-item-card" key={item.sku}>

                    <div className="item-icon">
                      {item.icon}
                    </div>


                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price-unit">₹{item.price} × {item.qty}</span>
                    </div>


                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => changeQty(item.sku, -1)}>−</button>
                      <span className="item-qty">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.sku, 1)}>+</button>
                    </div>


                    <div className="item-total">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>


                    <button
                      className="delete-btn"
                      onClick={() => deleteItem(item.sku)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-foot">
              <div className="line">
                <span style={{ color: "black" }}>Subtotal</span>
                <span style={{ color: "black" }} >₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="line">
                <span style={{ color: "black" }}>Tax ({taxRate}%)</span>
                <span style={{ color: "black" }}>₹{tax.toFixed(2)}</span>
              </div>

              <hr className="divider" />

              <div className="total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="action-buttons">
                <button className="hold" onClick={handleHold}>⏸ Hold</button>
                <button
                  className="pay"
                  onClick={handlepay}
                  disabled={total === 0}
                  style={{ opacity: total === 0 ? 0.5 : 1, cursor: total === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Pay ₹{Math.round(total)}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        count={count}
        onConfirm={handlePaymentConfirm}
      />
      {showInvoice && invoiceData && (
        <InvoiceModal
          invoice={invoiceData}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
}
