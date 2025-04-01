import React, { useEffect, useState } from "react";
import "../Styles/Tables.css";
import Banner from "../components/Banner";
import "../Styles/GlobalStyle.css";

const GivePermission = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchEvaluators();
  }, []);

  // Fetch Evaluators (Only Pending)
  const fetchEvaluators = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/evaluators", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch evaluators");
      const data = await response.json();

      // Filter only pending evaluators
      const pendingEvaluators = data.filter(
        (user) => user.approval_status === "pending"
      );

      setEvaluators(pendingEvaluators);
    } catch (err) {
      setError(err.message);
    }
  };

  // Approve Evaluator
  const approveEvaluator = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/approve/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to approve evaluator: ${response.status}`);
      fetchEvaluators(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Reject Evaluator
  const rejectEvaluator = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reject/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to reject evaluator: ${response.status}`);
      fetchEvaluators(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle File Upload
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/upload-evaluators", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json(); // Extract JSON response

        if (!response.ok) {
            alert(data.message || "Something went wrong"); // Show proper error message
        } else {
            alert(data.message || "Upload successful");
            fetchEvaluators(); // Refresh list
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
};


  return (
    <div>
      <Banner pageName="User Management" title="Approve Or Reject Evaluator" />
      
      
      <div className="button-container" style={{ display: "flex", justifyContent: "flex-end", marginRight: "5%" }}>
      <button onClick={handleFileSelect} className="button button-small">Upload Evaluator List</button>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Domain</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluators.length > 0 ? (
            evaluators.map((user) => (
              <tr key={user.uid}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role ? user.role : "Evaluator"}</td>
                <td>{user.domain}</td>
                <td>
                  <div className="actionbutton">
                    <button onClick={() => approveEvaluator(user.uid)}>
                      Approve
                    </button>
                    <button onClick={() => rejectEvaluator(user.uid)}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No pending evaluators
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GivePermission;
