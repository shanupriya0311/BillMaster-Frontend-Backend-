import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import "./ForgotPassword.css";
import { Mail, Store, Clock, FileText, Activity, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ForgotPassword({ onNavigate }) {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    const startResendTimer = () => {
        setResendTimer(30);
        timerRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await axios.post("http://localhost:8083/api/auth/forgot-password", { email });
            setStep("otp");
            startResendTimer();
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (err) {
            setError("Failed to send OTP. Please check the email address and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value.slice(-1);
        setOtp(updated);
        setError("");
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const updated = [...otp];
        pasted.split("").forEach((char, i) => { updated[i] = char; });
        setOtp(updated);
        const nextEmpty = updated.findIndex(v => !v);
        otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
        setError("");
        setLoading(true);
        try {
            await axios.post("http://localhost:8083/api/auth/verify-otp", { email, otp: code });
            onNavigate("ResetPassword");
        } catch (err) {
            setError("Invalid or expired OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setError("");
        setOtp(["", "", "", "", "", ""]);
        setLoading(true);
        try {
            await axios.post("http://localhost:8083/api/auth/forgot-password", { email });
            startResendTimer();
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch {
            setError("Failed to resend OTP. Please try again.");
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
                <div className="glass-card fp-card">

                    {/* Back button */}
                    <button className="fp-back-btn" onClick={() => step === "otp" ? setStep("email") : onNavigate("Home")}>
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </button>

                    {step === "email" ? (
                        <>
                            <h2 className="card-title fp-title">Forgot Password</h2>
                            <p className="fp-subtitle">Enter your email to receive an OTP</p>

                            <form onSubmit={handleSendOTP} className="login-form">
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={20} className="input-icon" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                            className="form-input"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {error && <div className="fp-error-msg"><span>⚠️</span> {error}</div>}

                                <button type="submit" className="btn-signin fp-btn" disabled={loading}>
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="fp-otp-icon">📬</div>
                            <h2 className="card-title fp-title">Enter OTP</h2>
                            <p className="fp-subtitle">
                                We sent a 6-digit code to<br />
                                <strong>{email}</strong>
                            </p>

                            <form onSubmit={handleVerifyOTP} className="login-form">
                                <div className="fp-otp-grid" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => otpRefs.current[i] = el}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className={`fp-otp-box ${digit ? "fp-otp-filled" : ""}`}
                                        />
                                    ))}
                                </div>

                                {error && <div className="fp-error-msg"><span>⚠️</span> {error}</div>}

                                <button type="submit" className="btn-signin fp-btn" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>

                                <p className="fp-resend">
                                    Didn't receive the code?{" "}
                                    {resendTimer > 0 ? (
                                        <span className="fp-resend-timer">Resend in {resendTimer}s</span>
                                    ) : (
                                        <span className="fp-resend-link" onClick={handleResend}>
                                            Resend OTP
                                        </span>
                                    )}
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
