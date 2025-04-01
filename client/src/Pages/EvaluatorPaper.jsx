import React, { useEffect, useState } from "react";
import { FaFileLines } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Banner from "../components/Banner";

import "../Styles/GlobalStyle.css"

const EvaluatorPapers = () => {
  const [papers, setPapers] = useState([]);
  const [allEvaluated, setAllEvaluated] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const evaluatorName = user?.name;
  const navigate = useNavigate();
  const { category } = useParams();
  console.log(category);

  useEffect(() => {
    if (!token) return;

    const fetchAssignedPapers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/assigned-papers",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        let data = await response.json();

        if (category) {
          data = data.filter(
            (paper) => paper.domain === decodeURIComponent(category)
          );
        }

        setPapers(data);
        setAllEvaluated(
          data.length > 0 &&
            data.every(
              (paper) => !paper.evaluation_pending && paper.score?.length > 0
            )
        );
      } catch (error) {
        console.error("Error fetching assigned papers:", error);
      }
    };

    fetchAssignedPapers();
  }, [token, category]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/,/g, "");
  };

  const handleEvaluation = (paperId) => {
    navigate(`/evaluate/${paperId}`);
  };

  const handleEdit = (paperId) => {
    navigate(`/edit-evaluate/${paperId}`);
  };

  const handleSaveAndNext = () => {
    if (allEvaluated) {
      navigate("/SelectTopPapers");
    }
  };

  const handleViewFile = async (filename) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-paper/${filename}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Error fetching file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Failed to open file");
    }
  };

  return (
    <div>
      <Banner
        pageName="Evaluator Dashboard"
        title={category ? `Papers - ${category}` : "Assigned Papers"}
      />
      <h2 className="page-title">
        Welcome, {evaluatorName || "Evaluator"}!
      </h2>
      <table
        border="1"
        style={{ margin: "auto", width: "95%", textAlign: "center" }}
      >
        <thead>
          <tr>
            <th>Paper Id</th>
            <th>Author</th>
            <th>Title</th>
            <th>Domain</th>
            <th>Paper File</th>
            <th>Total Score</th>
            <th>Session Start</th>
            <th>Session End</th>
            <th>Evaluation Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {papers.length > 0 ? (
            papers.map((paper) => (
              <tr key={paper.rid}>
                <td>{paper.rid}</td>
                <td>{paper.author_name}</td>
                <td>{paper.title}</td>
                <td>{paper.domain}</td>
                <td>
                  <FaFileLines
                    size={20}
                    onClick={() => handleViewFile(paper.paper_file)}
                    style={{ color: "#4b5056", cursor: "pointer" }}
                  />
                </td>
                <td>{paper.total_score ?? "N/A"}</td>
                <td>{formatDateTime(paper.session_start)}</td>
                <td>{formatDateTime(paper.session_end)}</td>
                <td>
                  <button
                    style={{
                      backgroundColor: paper.evaluation_pending
                        ? "#3498db"
                        : "#808080",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px 10px",
                      cursor: paper.evaluation_pending
                        ? "pointer"
                        : "not-allowed",
                    }}
                    disabled={!paper.evaluation_pending}
                    onClick={() => handleEvaluation(paper.rid)}
                  >
                    {paper.evaluation_pending ? "Evaluate" : "Completed"}
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: paper.evaluation_pending
                        ? "#808080"
                        : "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px 20px",
                      cursor: paper.evaluation_pending
                        ? "not-allowed"
                        : "pointer",
                    }}
                    disabled={paper.evaluation_pending}
                    onClick={() => handleEdit(paper.rid)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
                style={{
                  textAlign: "center",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                No related records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "40px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: allEvaluated ? "#008000" : "#D3D3D3",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: allEvaluated ? "pointer" : "not-allowed",
            width: "150px",
          }}
          disabled={!allEvaluated}
          onClick={handleSaveAndNext}
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default EvaluatorPapers;
