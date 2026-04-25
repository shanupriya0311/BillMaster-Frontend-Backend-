import React, { useState } from "react";
import "./Home.css";
import { Mail, Lock, Store, Clock, FileText, Activity, ArrowLeft } from "lucide-react";
import axios from "axios";
export default function Home({ onLogin, onNavigate }) {
    const [showError, setShowError] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotStatus, setForgotStatus] = useState(null);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [form, setuserform] = useState({
        email: "",
        password: ""
    })
    const { email, password } = form;
    const roleToDashboard = {
        ROLE_CASHIER: "CashierDashboard",
        ROLE_MANAGER: "ManagerDashboard",
        ROLE_ADMIN: "Dashboard"
    };


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8083/api/auth/login",
                form
            );

            setShowError(false);

            onLogin(
                response.data,
                roleToDashboard[response.data.role]
            );

        } catch (error) {
            setShowError(true);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        try {
            await axios.post("http://localhost:8083/api/auth/forgot-password", { email: forgotEmail });
            setForgotStatus("success");
        } catch (err) {
            setForgotStatus("success");
        } finally {
            setForgotLoading(false);
        }
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setForgotEmail("");
        setForgotStatus(null);
        setForgotLoading(false);
    };


    return (
        <div className="landing-wrapper">
            {/* LEFT PANEL */}
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
                        Streamline your
                        <br />
                        retail operations
                    </h1>

                    <p className="description">
                        Fast billing, smart inventory management, and
                        powerful analytics — all in one modern POS system.
                    </p>

                    <div className="stats-bar">
                        <div className="stat-group">
                            <Clock className="stat-icon" size={24} />
                            <div>
                                <h3>&lt; 10s</h3>
                                <p>Fast Checkout</p>
                            </div>
                        </div>
                        <div className="stat-group">
                            <FileText className="stat-icon" size={24} />
                            <div>
                                <h3>Auto</h3>
                                <p>Daily Reports</p>
                            </div>
                        </div>
                        <div className="stat-group">
                            <Activity className="stat-icon" size={24} />
                            <div>
                                <h3>99.9%</h3>
                                <p>Uptime</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright">
                    &copy; 2024 BillMaster, Enterprise POS Solution
                </div>
            </section>

            {/* RIGHT PANEL */}
            <section className="right-action">
                <div className="glass-card">
                    <h2 className="card-title">Welcome back.</h2>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={(e) => setuserform(prev => ({ ...prev, email: e.target.value }))}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={(e) => setuserform(prev => ({ ...prev, password: e.target.value }))}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-signin">
                            Sign In
                        </button>

                    </form>
                </div>
            </section>

            {/* Error Popup */}
            {showError && (
                <div className="error-overlay" onClick={() => setShowError(false)}>
                    <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="error-icon">❌</div>
                        <h3>Invalid Credentials</h3>
                        <p>The email or password you entered is incorrect. Please try again.</p>
                        <button className="error-close-btn" onClick={() => setShowError(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="error-overlay" onClick={closeForgotModal}>
                    <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
                        {forgotStatus === "success" ? (
                            <div className="forgot-success">
                                <div className="forgot-success-icon">✉️</div>
                                <h3>Check Your Email</h3>
                                <p>
                                    If an account exists for <strong>{forgotEmail}</strong>, a password reset link has been sent.
                                </p>
                                <button className="btn-forgot-submit" onClick={closeForgotModal}>
                                    Back to Sign In
                                </button>
                                {onNavigate && (
                                    <button
                                        className="btn-forgot-submit"
                                        style={{ background: "#0f172a", marginTop: "8px" }}
                                        onClick={() => { closeForgotModal(); onNavigate("ResetPassword"); }}
                                    >
                                        Reset Password Now
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="forgot-back-btn" onClick={closeForgotModal}>
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <div className="forgot-icon-wrap">🔐</div>
                                <h3 className="forgot-title">Forgot Password?</h3>
                                <p className="forgot-desc">
                                    No worries! Enter your email address below and we'll send you a reset link.
                                </p>
                                <form onSubmit={handleForgotPassword} className="forgot-form">
                                    <div className="input-wrapper">
                                        <Mail size={20} className="input-icon" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            className="form-input"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-forgot-submit"
                                        disabled={forgotLoading}
                                    >
                                        {forgotLoading ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}