import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { RiArrowDropDownLine } from "react-icons/ri";
import { BsUpload } from "react-icons/bs";

import "../Styles/Header.css";
import "../Styles/GlobalStyle.css"


const Header = () => {
  // const [showCategories, setShowCategories] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user.role);
      localStorage.setItem("role", user.role);
    }
  }, []);

  const handleAssignmentClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xls,.xlsx";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token missing. Please log in.");
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/assign-evaluator",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(response.data.message);
      } catch (error) {
        alert(error.response?.data?.message || "Error uploading file");
      }
    };

    input.click();
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      alert("Error logging out!");
    }
  };

  return (
    <header className="navbar">
      <div className="logo-container">
        <img src="/Assets/logo_picet.png" alt="PICET" />
      </div>


      <nav className="nav-links">
        <Link to="/" className="nav-item">Home</Link>


        {/* Papers Section - Role-Based Navigation */}
        {role === "admin" ? (
          // <Link to="/admin/papers" className="nav-item">Papers</Link>

          <div
            className="nav-item dropdown"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <Link to="/admin/papers" className="nav-item">
              <span className="nav-text">Papers</span>
              <RiArrowDropDownLine size={20} className="dropdown-icon" />
            </Link>
  
            {showCategories && (
              <div className="dropdown-menu">
                <Link to="/admin/papers">All</Link>
                <Link to="admin/papers/category/Artificial Intelligence and Machine Learning">Artificial Intelligence</Link>
                <Link to="admin/papers/category/Computational and Cognitive Intelligence">Computational and Cognitive Intelligence</Link>
                <Link to="admin/papers/category/Sustainable Engineering">Sustainable Engineering</Link>
                <Link to="admin/papers/category/Process Modelling and Simulation">Process Modeling and Simulation</Link>
                <Link to="admin/papers/category/Cybersecurity and Blockchain">Cybersecurity and Blockchain</Link>
                <Link to="admin/papers/category/Robotics and Automation">Robotics and Automation</Link>
                <Link to="admin/papers/category/Nano Technology">Nano Technology</Link>
              </div>
            )}
          </div>


        ) : role === "evaluator" ? (

          // <Link to="/evaluator/papers" className="nav-item">Papers</Link>
          <div
            className="nav-item dropdown"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <Link to="/evaluator/papers" className="nav-item">
              <span className="nav-text">Papers</span>
              <RiArrowDropDownLine size={20} className="dropdown-icon" />
            </Link>
  
            {showCategories && (
              <div className="dropdown-menu">
                <Link to="/evaluator/papers">All</Link>
                <Link to="/evaluator/papers/category/Artificial Intelligence and Machine Learning">Artificial Intelligence</Link>
                <Link to="/evaluator/papers/category/Computational and Cognitive Intelligence">Computational and Cognitive Intelligence</Link>
                <Link to="/evaluator/papers/category/Sustainable Engineering">Sustainable Engineering</Link>
                <Link to="/evaluator/papers/category/Process Modelling and Simulation">Process Modeling and Simulation</Link>
                <Link to="/evaluator/papers/category/Cybersecurity and Blockchain">Cybersecurity and Blockchain</Link>
                <Link to="/evaluator/papers/category/Robotics and Automation">Robotics and Automation</Link>
                <Link to="/evaluator/papers/category/Nano Technology">Nano Technology</Link>
              </div>
            )}

          </div>        


        ) : null}

        {/* User Management - Only for Admin */}
        {role === "admin" && (
          <div
            className="nav-item dropdown"
            onMouseEnter={() => setShowUserManagement(true)}
            onMouseLeave={() => setShowUserManagement(false)}
          >
              <span className="nav-text" style={{ cursor: "pointer" }} >User Management</span>
              <RiArrowDropDownLine size={20} className="dropdown-icon" />

            {showUserManagement && (
              <div className="dropdown-menu">
                <Link to="/givePermission">Permission</Link>
                <Link to="/list">Evaluators List</Link>
              </div>
            )}
          </div>
        )}

        {/* Upload Button - Only for Admin */}
        {role === "admin" && (
          <Link to="/upload" className="button button-small">
            <span className="nav-text">Upload</span>
            <BsUpload size={17} className="upload-icon" />
          </Link>
        )}

        {/* Assign Button - Only for Admin */}
        {role === "admin" && (
          <Link className="button button-small" onClick={handleAssignmentClick}>
            <span className="nav-text">Assign</span>
          </Link>
        )}

        <Link className="button button-small" onClick={handleLogout}>
          <span className="nav-text">Logout</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;