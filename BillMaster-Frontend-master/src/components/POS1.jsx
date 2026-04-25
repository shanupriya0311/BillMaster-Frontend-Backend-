import React, { useState } from 'react';
import './POS1.css';

const PRODUCTS = [
  { id: 1, name: 'Coca-Cola 500ml', cat: 'Beverages', price: 40, icon: '🥤' },
  { id: 2, name: 'Pepsi 500ml', cat: 'Beverages', price: 40, icon: '🥤' },
  { id: 3, name: 'Lays Classic 50g', cat: 'Snacks', price: 20, icon: '🍟' },
  { id: 4, name: 'Pringles Original', cat: 'Snacks', price: 99, icon: '🥔' },
  { id: 5, name: 'Amul Milk 500ml', cat: 'Dairy', price: 28, icon: '🥛' },
  { id: 6, name: 'Amul Butter 100g', cat: 'Dairy', price: 56, icon: '🧈' },
  { id: 7, name: 'Britannia Bread', cat: 'Bakery', price: 45, icon: '🍞' },
  { id: 8, name: 'Dairy Milk Silk', cat: 'Confectionery', price: 85, icon: '🍫' },
  { id: 9, name: 'KitKat 4 Finger', cat: 'Confectionery', price: 40, icon: '🍫' },
  { id: 10, name: 'Colgate Toothpaste', cat: 'Personal Care', price: 120, icon: '🦷' }
];

const POS = () => {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));


  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  return (
    <div className="pos-app">

      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-box">🏪</div>
          <div><h3>BillMaster</h3><p>Point of Sale</p></div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item active">🛒 Point of Sale</div>
          <div className="nav-item">📦 Products</div>
          <div className="nav-item">📊 Reports</div>
        </nav>
        <div className="user-profile">Mike Admin</div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Point of Sale</h2>
          <div className="meta">01:28 PM 🔔</div>
        </header>

        <div className="pos-body">
          <section className="product-area">
            <div className="search-bar">
              <input type="text" placeholder="Search products..." />
              <input type="text" placeholder="Scan barcode..." className="barcode-input" />
            </div>

            <div className="quick-keys">
              <p>Quick Keys</p>
              <div className="quick-grid">
                {PRODUCTS.slice(0, 8).map(p => (
                  <div key={p.id} className="card mini" onClick={() => addToCart(p)}>
                    <span>{p.icon}</span> {p.name.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {PRODUCTS.map(p => (
                <div key={p.id} className="card main" onClick={() => addToCart(p)}>
                  <div className="icon">{p.icon}</div>
                  <div className="name">{p.name}</div>
                  <div className="cat">{p.cat}</div>
                  <div className="price">₹{p.price}</div>
                </div>
              ))}
            </div>
          </section>


          <aside className="cart-section">
            <div className="cart-header">
              Current Order <span>{cart.length} items</span>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">No items in cart</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-info">
                      <strong>{item.name}</strong>
                      <p>₹{item.price} x {item.qty}</p>
                    </div>
                    <div className="item-total">₹{item.price * item.qty}</div>
                    <button onClick={() => removeFromCart(item.id)}>🗑️</button>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              <div className="row">Subtotal <span>₹{subtotal.toFixed(2)}</span></div>
              <div className="row">Tax (12%) <span>₹{tax.toFixed(2)}</span></div>
              <div className="row total">Total <span>₹{total.toFixed(2)}</span></div>
              <div className="actions">
                <button className="btn-hold">Hold</button>
                <button className="btn-pay" onClick={() => setIsModalOpen(true)}>
                  Pay ₹{Math.round(total)}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Complete Payment</h3>
            <div className="modal-amount">
              <p>Amount to Pay</p>
              <h1>₹{total.toFixed(2)}</h1>
            </div>
            <div className="payment-methods">
              <button className="active">💵 Cash</button>
              <button>💳 Card</button>
              <button>📱 UPI</button>
            </div>
            <div className="modal-btns">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="confirm" onClick={() => setIsModalOpen(false)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;