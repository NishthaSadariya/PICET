import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  FaUser,
  FaFileAlt,
  FaCloudUploadAlt,
  FaBook,
  FaHashtag,
} from "react-icons/fa";
import Banner from "../components/Banner";
import "../Styles/Upload.css";
import "../Styles/GlobalStyle.css";

const UploadResearchPaper = () => {
  const [formData, setFormData] = useState({
    rid: "",
    author_name: "",
    title: "",
    paper_file: null,
    domain: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, paper_file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("rid", formData.rid);
    formDataToSend.append("author_name", formData.author_name);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("paper_file", formData.paper_file);
    formDataToSend.append("domain", formData.domain);

    try {
      const response = await fetch(
        "http://localhost:5000/api/upload-research-paper",
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If authentication is required
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        navigate("/admin/papers");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading research paper:", error);
      alert("Error uploading research paper");
    }
  }; 

  return (
    <div>
      <Banner pageName="Upload" title="Upload Manuscript"></Banner>

      <div className="upload-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <FaHashtag className="icon" />
              <input
                type="text"
                name="rid"
                placeholder="Paper ID"
                value={formData.rid}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="icon" />
              <input
                type="text"
                name="author_name"
                placeholder="Author Name"
                value={formData.author_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaFileAlt className="icon" />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaCloudUploadAlt className="icon" />
              <input
                type="file"
                name="paper_file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaBook className="icon" />
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
              >
                <option value="">Select Domain</option>
                {domains.map((domain, index) => (
                  <option key={index} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="button button-medium">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResearchPaper;
