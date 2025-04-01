import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePerson } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import { RiLock2Line } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import "../Styles/GlobalStyle.css";
import "../Styles/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [domain, setDomain] = useState("Select Domain");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const domains = [
    "Artificial Intelligence and Machine Learning",
    "Computational and Cognitive Intelligence",
    "Nano Technology",
    "Sustainable Engineering",
    "Process Modelling and Simulation",
    "Cybersecurity and Blockchain",
    "Robotics and Automation",
  ];
  const validateField = (field, value) => {
    let errorMessage = "";
    if (field === "name" && !/^[a-zA-Z\s_]+$/.test(value)) {
      errorMessage =
        "Name should only contain letters, spaces, and underscores.";
    } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = "Invalid email format.";
    } else if (
      field === "password" &&
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    ) {
      errorMessage =
        "Password must be at least 8 characters, include a letter, number, and special character.";
    } else if (field === "confirmPassword" && value !== password) {
      errorMessage = "Passwords do not match.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (
      Object.values(errors).some((error) => error !== "") ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      domain === "Select Domain"
    ) {
      setServerError("Please fill out all fields correctly.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, domain }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      alert("Registration successful! Redirecting to login...");
      navigate("/");
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="page-title">Register</h2>
      {serverError && <p className="error-message">{serverError}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <MdOutlinePerson className="icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => validateField("name", name)}
          />
        </div>
        {errors.name && <p className="error">{errors.name}</p>}

        <div className="input-group">
          <TfiEmail className="icon" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField("email", email)}
          />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div
          className="dropdown"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{domain}</span>
          <FaChevronDown className="icon" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              {domains.map((item, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents dropdown from closing when selecting
                    setDomain(item);
                    setDropdownOpen(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group">
          <span className="icon">
            <RiLock2Line />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validateField("password", password)} // Add this
          />

          <span className="icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="input-group">
          <span className="icon">
            <RiLock2Line />
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => validateField("confirmPassword", confirmPassword)} // Add this
          />
          <span
            className="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button className="button button-medium" type="submit">
          Register
        </button>
        <p className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
