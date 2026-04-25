import React, { useState } from "react";
import "./Home.css";
import "./ResetPassword.css";
import { Lock, Store, Clock, FileText, Activity, ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function ResetPassword({ onNavigate, token }) {
    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setError("");
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }
        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8083/api/auth/reset-password", {
                token,
                newPassword: form.newPassword,
            });
            setShowSuccess(true);
        } catch (err) {
            setError("Something went wrong. The reset link may have expired.");
        } finally {
            setLoading(false);
        }
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
                <div className="glass-card rp-card">
                    {/* Back link */}
                    <button
                        className="rp-back-btn"
                        onClick={() => onNavigate("Home")}
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </button>

                    <h2 className="card-title rp-title">Reset Password</h2>
                    <p className="rp-subtitle">Enter your new password below</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        {/* New Password */}
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showNew ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    className="form-input rp-input"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="rp-eye-btn"
                                    onClick={() => setShowNew(p => !p)}
                                    tabIndex={-1}
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input rp-input"
                                    required
                                />
                                <button
                                    type="button"
                                    className="rp-eye-btn"
                                    onClick={() => setShowConfirm(p => !p)}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Inline error */}
                        {error && (
                            <div className="rp-error-msg">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-signin rp-confirm-btn"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Confirm"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Success Popup */}
            {showSuccess && (
                <div className="error-overlay" onClick={() => onNavigate("Home")}>
                    <div
                        className="error-popup success-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="success-icon">✅</div>
                        <h3>Password Reset!</h3>
                        <p>Your password has been successfully updated. You can now sign in with your new credentials.</p>
                        <button
                            className="error-close-btn success-close-btn"
                            onClick={() => onNavigate("Home")}
                        >
                            Go to Sign In
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
