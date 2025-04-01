import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import "../Styles/Tables.css";
import "../Styles/GlobalStyle.css"
import axios from "axios";

const ListOfEvaluator = () => {
    const [evaluators, setEvaluators] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchEvaluators = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/evaluators", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const approvedEvaluators = response.data.filter(user => user.approval_status === "approved");
                setEvaluators(approvedEvaluators);
            } catch (error) {
                console.error("Error fetching evaluators:", error);
            }
        };

        if (token) {
            fetchEvaluators();
        } else {
            console.warn("No token found! User may not be authenticated.");
        }
    }, [token]);

    const downloadEvaluatorList = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/evaluatorslist-download", {
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
        <>
        <style>
          {`
              .button-container {
                  display: flex;
                  justify-content: flex-end;
                  gap:20px;
                  margin-top: 20px;
                  margin-right:80px;
              }
          `}
        </style>
        <div>
            <Banner pageName="User Management" title="List Of Approved Evaluators" />
            <div className="button-container" style={{ display: "flex", justifyContent: "flex-end", marginRight: "5%" }}>
                <button className="button button-small"  onClick={downloadEvaluatorList}>Download</button>
            </div>
            <table border="1">
                <thead>
                    <tr>
                        <th>UID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Domain</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluators.length > 0 ? (
                        evaluators.map((user) => (
                            <tr key={user.uid}>
                                <td>{user.uid}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.domain}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>No Approved Evaluators Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default ListOfEvaluator;
