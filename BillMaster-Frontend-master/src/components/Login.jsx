import axios from "axios";
import "./Login.css";
import { useState } from "react";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handler = async () => {
    try {
      const response = await axios.post("http://localhost:8083/api/auth/login", {
        email: email,
        password: password
      });

      console.log("Login Success");
      console.log(response.data);   // 👈 THIS contains username + role

    } catch (error) {
      console.log("Login failure", error);
    }
  };

  return (
    <div className="page">
      <div className="right">
        <div className="form-box">

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="signin" onClick={handler}>
            Sign In
          </button>

        </div>
      </div>
    </div>
  );
}
