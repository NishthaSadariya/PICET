import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import {TfiEmail} from "react-icons/tfi"
import { RiLock2Line } from "react-icons/ri"; 

import "../Styles/Login.css";
import "../Styles/GlobalStyle.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful! Redirecting...");
      navigate("/"); // Redirect user after login
    } catch (err) {
      alert(err.message); // Show error in alert box
    }
  };

  return (
    <div className="auth-container">        
        <h2 className="page-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <TfiEmail className="icon"  />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <RiLock2Line className="icon"  />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showPassword ? (
            <FaEyeSlash className="password-toggle" onClick={() => setShowPassword(false)}  />
          ) : (
            <FaEye className="password-toggle" onClick={() => setShowPassword(true)}  />
          )}
        </div>

        <button type="submit" className="button button-medium">Login</button>
      </form>

      <p>
        <a href="/forgot-password" className="auth-link">
          Forgot Password?
        </a>
      </p>

      <p>
        Don't have an account? <a href="/register" className="auth-link">Register</a>
      </p>
    </div>
  );
};

export default Login;
