import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/TopRatedPapers.css"
import "../Styles/GlobalStyle.css"

const TopRatedPapers = () => {
    const [papers, setPapers] = useState([]);
    const [selectedPapers, setSelectedPapers] = useState({ rank1: "", rank2: "", rank3: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Unauthorized: No token found");
                
                const response = await fetch("http://localhost:5000/api/assigned-papers", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                console.log("Assigned Papers:", data);
                setPapers(data);
            } catch (error) {
                console.error("Error fetching papers:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPapers();
    }, []);
    
    const handleRankChange = (rank, paperId) => {
        setSelectedPapers(prev => {
            const updatedSelection = { ...prev };
            
            // Ensure no duplicate selections
            if (Object.values(updatedSelection).includes(paperId)) {
                alert("This paper is already selected for another rank.");
                return prev;
            }
            
            updatedSelection[rank] = paperId;
            return updatedSelection;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPapers.rank1) {
            alert("Rank 1 selection is mandatory.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized: No token found");
    
            const selectedPaperArray = Object.values(selectedPapers).filter(rid => rid).map(Number);
    
            console.log("Selected Papers Sent:", selectedPaperArray);
    
            const assignedPaperIds = papers.map(paper => paper.rid);
            const invalidPapers = selectedPaperArray.filter(rid => !assignedPaperIds.includes(rid));
    
            if (invalidPapers.length > 0) {
                alert("Some selected papers are not assigned to you.");
                console.log("Invalid Papers:", invalidPapers);
                return;
            }
    
            const response = await fetch("http://localhost:5000/api/select-top-papers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ selectedPapers: selectedPaperArray })
            });
    
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || "Failed to submit rankings");
    
            alert("Top Rated Papers Submitted Successfully!");
            await generateReport();
            navigate("/");
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error("Submit error:", error);
        }
    };
    
    const generateReport = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized: No token found");

            const response = await fetch("http://localhost:5000/api/download-report", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Error generating report");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Session Report.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(`Error generating report: ${error.message}`);
            console.error("Report error:", error);
        }
    };

    return (
        <div className="top-rated-container">
            <h2 className="page-title">Top Rated Research Papers</h2>
            {loading ? <p>Loading...</p> : (
                <form onSubmit={handleSubmit}>
                    {["rank1", "rank2", "rank3"].map((rank, index) => (
                        <div className="form-group" key={index}>
                            <label className="rating-label">Suggest {rank.replace("rank", "Rank ")}</label>
                            <select className="ranking-select"
                                value={selectedPapers[rank]}
                                onChange={(e) => handleRankChange(rank, e.target.value)}
                                required={rank === "rank1"}
                            >
                                <option value="">Select a Research Paper</option>
                                {papers.filter(paper => !Object.values(selectedPapers).includes(paper.rid) || selectedPapers[rank] === paper.rid)
                                    .map(paper => (
                                        <option key={paper.rid} value={paper.rid}>
                                            {paper.title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    ))}
                    <button type="submit" className="button button-medium">Submit Rankings</button>
                </form>
            )}
        </div>
    );
};

export default TopRatedPapers;