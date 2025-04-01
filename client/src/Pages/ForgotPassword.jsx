import React, { useState } from "react";
import { TfiEmail } from "react-icons/tfi";

import axios from "axios";
import "../Styles/ForgotPassword.css";
import "../Styles/GlobalStyle.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container forgot-password-container">
      <h2 className="page-title">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <TfiEmail className="icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button button-medium">
          Submit
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
