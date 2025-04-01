import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaFileLines } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import axios from "axios";


import "../Styles/GlobalStyle.css"
import "../Styles/AdminPaper.css"

const AdminPapers = () => {
  const [papers, setPapers] = useState([]);
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder]= useState(null); // null -> default, "asc" -> ascending, "desc" -> descending

  const token = localStorage.getItem("token");
  const { category } = useParams();

  useEffect(() => {
    if (!token) return;

    const fetchPapers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get-paper-details", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        let data = await response.json();

        if (category) {
          data = data.filter((paper) => paper.domain === decodeURIComponent(category));
        }

        setPapers(data);
        setMessage(data.length ? "" : "No papers found.");
      } 
      catch (error) {
        console.error("Error fetching papers:", error);
        setMessage("Failed to load papers.");
      }
    };

    fetchPapers();
  }, [token, category]);

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-paper/${filename}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error fetching file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  const handleDelete = async (rid) => {
    if (!window.confirm("Are you sure you want to delete this paper?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/delete-research-paper/${rid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error deleting paper");
      setPapers(papers.filter((paper) => paper.rid !== rid));
    } catch (error) {
      console.error("Error deleting paper:", error);
      alert("Failed to delete paper");
    }
  };

  // handle sorting of records based on rating.
  const handleSort = (order) => {
    const sortedPapers = [...papers].sort((a, b) => {
      const getTotalScore = (paper) => {
        const ratings = paper.ResearchPaperRatings || [];
        return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + (rating.q1 + rating.q2 + rating.q3 + rating.q4 + rating.q5), 0) : 0;
      };

      return order === "asc" ? getTotalScore(a) - getTotalScore(b) : getTotalScore(b) - getTotalScore(a);
    });

    setPapers(sortedPapers);
    setSortOrder(order);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // download excel report 
  const excelReport = async () => {
          try {
              const response = await axios.get("http://localhost:5000/api/generate-research-report", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
                  responseType: "blob", 
              });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "Evaluators_List.xlsx");
              document.body.appendChild(link);
              link.click();
              link.remove();
          } catch (error) {
              console.error("Error downloading evaluator list:", error);
          }
      };

  return (
    <div>
      <Banner pageName="Admin Panel" title={category ? `Papers - ${category}` : "All Research Papers"} />
      <div className="button-container">
        
        <button className="button button-small" onClick={excelReport}>Download</button>

        {/* sorting button with dropdown-> ascending and descending order */}
        <div className="sort-dropdown-container">
          <button className="button button-small" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            Sort <IoMdArrowDropdown />
          </button>
          
          {isDropdownOpen && (
            <div className="sort-dropdown-menu">
              
              <div onClick={() => handleSort("asc")}>Ascending Order</div>
              <div onClick={() => handleSort("desc")}>Descending Order</div>
              
            </div>
          )}
        </div>
      </div>
      
      {message ? (
        <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Paper Id</th>
              <th>Author</th>
              <th>Title</th>
              <th>Domain</th>
              <th>Paper File</th>
              <th>Total Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => {
              const ratings = paper.ResearchPaperRatings || [];
              const totalScore =
                ratings.length > 0
                  ? ratings.reduce((sum, rating) => sum + (rating.q1 + rating.q2 + rating.q3 + rating.q4 + rating.q5), 0)
                  : "Not Rated";

              return (
                <tr key={paper.rid}>
                  <td>{paper.rid}</td>
                  <td>{paper.author_name}</td>
                  <td>{paper.title}</td>
                  <td>{paper.domain}</td>
                  <td>
                    <FaFileLines 
                        size={20}
                        onClick={() => handleDownload(paper.paper_file)} 
                        style={{ color: '#4b5056', cursor: 'pointer' }} 
                    />
                  </td>

                  <td>{totalScore}</td> 
                  <td>
                    <MdDelete 
                      size={20}
                      onClick={() => handleDelete(paper.rid)}
                      style={{ color: '#eb0000', cursor: 'pointer' }} 
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
    
  );
};

export default AdminPapers;