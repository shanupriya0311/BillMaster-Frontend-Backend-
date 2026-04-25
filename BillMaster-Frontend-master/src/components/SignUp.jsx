import React, { useState } from "react";
import "./Home.css";
import { User, Building2, Phone, Coins, CreditCard, Store, Clock, FileText, Activity, Mail, Lock, ChevronDown } from "lucide-react";
import axios from "axios";
export default function SignUp({ onNavigate }) {
    const [showSuccess, setShowSuccess] = useState(false);
     const[formdata,setformdata]=useState({
        username:"",
        email:"",
        password:"",
        role:"ROLE_ADMIN"
    });
    const currencyOptions = [
        { value: "INR", label: "₹ INR - Indian Rupee" },
        { value: "USD", label: "$ USD - US Dollar" },
        { value: "EUR", label: "€ EUR - Euro" },
        { value: "GBP", label: "£ GBP - British Pound" },
        { value: "AED", label: "د.إ AED - UAE Dirham" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdata(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      " http://localhost:8083/api/auth/register",
      formdata
    );

    console.log("SignUp Data:", response.data);
    setShowSuccess(true);

  } catch (err) {
    console.error(err);
  }
};


    const handleSuccessClose = () => {
        setShowSuccess(false);
        onNavigate("Home"); 
    };
   
    return (
        <div className="landing-wrapper">
          
            <section className="left-branding">
                <div className="brand-header">
                    <div className="logo-box">
                        <Store size={24} color="#0f172a" strokeWidth={2.5} />
                    </div>
                    <div className="brand-info">
                        <h2 className="brand-name">BillMaster</h2>
                        <span className="brand-tagline">Point of Sale System</span>
                    </div>
                </div>

                <div className="hero-content">
                    <h1 className="headline">
                        Start your
                        <br />
                        business journey
                    </h1>

                    <p className="description">
                        Join thousands of businesses using BillMaster for seamless
                        billing, inventory management, and real-time analytics.
                    </p>

                    <div className="stats-bar">
                        <div className="stat-group">
                            <Clock className="stat-icon" size={24} />
                            <div>
                                <h3>5 min</h3>
                                <p>Setup Time</p>
                            </div>
                        </div>
                        <div className="stat-group">
                            <FileText className="stat-icon" size={24} />
                            <div>
                                <h3>Free</h3>
                                <p>14-day Trial</p>
                            </div>
                        </div>
                        <div className="stat-group">
                            <Activity className="stat-icon" size={24} />
                            <div>
                                <h3>24/7</h3>
                                <p>Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright">
                    &copy; 2024 BillMaster, Enterprise POS Solution
                </div>
            </section>

            {/* RIGHT PANEL */}
            <section className="right-action signup-panel">
                <div className="glass-card signup-card">
                    <h2 className="card-title">Create Account</h2>
                    <p className="card-subtitle">Fill in your business details to get started</p>

                    <form onSubmit={handleSubmit} className="login-form signup-form">
                        <div className="form-section">
                            <h3 className="section-title">User Details</h3>

                            <div className="input-group">
                                <label>Username</label>
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter your name"
                                        value={formdata.username}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formdata.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create a password"
                                        value={formdata.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Details Section */}
                        <div className="form-section">
                            <h3 className="section-title">Business Details</h3>

                            <div className="input-group">
                                <label>Business Name</label>
                                <div className="input-wrapper">
                                    <Building2 size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="businessName"
                                        placeholder="Enter business name"
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Phone Number</label>
                                <div className="input-wrapper">
                                    <Phone size={20} className="input-icon" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Enter phone number"
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Currency Type</label>
                                <div className="input-wrapper">
                                    <Coins size={20} className="input-icon" />
                                    <select
                                        name="currencyType"
                                        onChange={handleChange}
                                        className="form-input form-select"
                                        required
                                    >
                                        {currencyOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="select-arrow" />
                                </div>
                            </div>
                        </div>

                        {/* Bank Details Section */}
                        <div className="form-section">
                            <h3 className="section-title">Bank Details</h3>

                            <div className="input-group">
                                <label>Bank Name</label>
                                <div className="input-wrapper">
                                    <Building2 size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="bankName"
                                        placeholder="Enter bank name"
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Account Number</label>
                                <div className="input-wrapper">
                                    <CreditCard size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        placeholder="Enter account number"
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>IFSC Code</label>
                                <div className="input-wrapper">
                                    <CreditCard size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        placeholder="Enter IFSC code"
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-signin btn-signup">
                            Create Account
                        </button>

                        <p className="signin-link">
                            Already have an account?{" "}
                            <a onClick={() => onNavigate("Home")} className="link">
                                Sign In
                            </a>
                        </p>
                    </form>
                </div>
            </section>

            {/* Success Popup */}
            {showSuccess && (
                <div className="error-overlay" onClick={handleSuccessClose}>
                    <div className="error-popup success-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="error-icon success-icon">✅</div>
                        <h3>Account Created!</h3>
                        <p>Your account has been successfully created. You can now sign in with your credentials.</p>
                        <button className="error-close-btn success-close-btn" onClick={handleSuccessClose}>
                            Go to Sign In
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
