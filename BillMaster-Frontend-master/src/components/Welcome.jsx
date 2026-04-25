import Home from "./Home";
import "./Welcome.css";


export default function Welcome({ onNavigate }) {

    return (
        <div className="page">
            <section className="left-panel">
                <div className="welcome-logo-box">
                    <div className="logo-icon">
                        <i className="fas fa-store"></i>
                    </div>
                    <span className="logo-text">BillMaster</span>
                </div>

                <h1 className="headline">
                    Streamline your <br />
                    <span className="highlight">retail operations</span>
                </h1>

                <p className="description">
                    The all-in-one POS solution for modern businesses. Fast billing,
                    smart inventory, and powerful analytics built to scale.
                </p>

                <div className="stats-grid">
                    <div className="stat-item">
                        <h3>&lt; 10s</h3>
                        <p>Checkout</p>
                    </div>
                    <div className="stat-item">
                        <h3>Auto</h3>
                        <p>Reports</p>
                    </div>
                    <div className="stat-item">
                        <h3>99.9%</h3>
                        <p>Uptime</p>
                    </div>
                </div>
            </section>

            {/* RIGHT PANEL */}
            <section className="right-panel">
                <div className="glass-card">
                    <h2 className="card-title">Welcome</h2>

                    <div className="instruction-box">
                        <p>
                            <b>Sign in to access your dashboard and manage your retail operations seamlessly</b>
                        </p>
                    </div>

                    <div className="btn-stack">
                        <button
                            onClick={() => onNavigate("Home")}
                            className="btn btn-signin"
                        >
                            Sign In
                        </button>
                    </div>
                    {/*<div style={{textAlign:"center",padding:"10px"}}>
                        <p>
                            <b>Need help ? <a>Contact  Support</a></b>
                        </p>
                    </div>*/}

                </div>
            </section>
        </div>
    );
}
