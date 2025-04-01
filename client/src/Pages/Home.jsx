import React from "react";
import { Link } from "react-router-dom"; 
import Banner from "../components/Banner.jsx";
import "../Styles/Home.css"; 

// React Icons:
import { FaBrain } from "react-icons/fa6"; // Artificial Intelligence
import { FaMicrochip } from "react-icons/fa6"; // Nanotechnology
import { BsRobot } from "react-icons/bs"; // Robotics and Automation
import { PiPlantFill } from "react-icons/pi"; // Sustainable Engineering
import { MdOutlineInsertChart, MdOutlineSecurity } from "react-icons/md"; // Process Modelling, Cybersecurity
import { HiOutlineLightBulb } from "react-icons/hi"; // Computational Intelligence

const Home = () => {
 
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const tracks = [
    {
      icon: <FaBrain />,
      title: "Artificial Intelligence and Machine Learning",
      link: role === "admin" ? "admin/papers/category/Artificial Intelligence and Machine Learning" : "evaluator/papers/category/Artificial Intelligence and Machine Learning",
    },
    {
      icon: <HiOutlineLightBulb />,
      title: "Computational and Cognitive Intelligence",
      link: role === "admin" ? "admin/papers/category/Computational and Cognitive Intelligence" : "evaluator/papers/category/Computational and Cognitive Intelligence",
    },
    { 
      icon: <FaMicrochip />, 
      title: "Nano Technology", 
      link: role === "admin" ? "admin/papers/category/Nano Technology" : "evaluator/papers/category/Nano Technology" 
    },
    { 
      icon: <PiPlantFill />, 
      title: "Sustainable Engineering", 
      link: role === "admin" ? "admin/papers/category/Sustainable Engineering" : "evaluator/papers/category/Sustainable Engineering" 
    },
    {
      icon: <MdOutlineInsertChart />,
      title: "Process Modelling and Simulation",
      link: role === "admin" ? "admin/papers/category/Process Modelling and Simulation" : "evaluator/papers/category/Process Modelling and Simulation",
    },
    { 
      icon: <MdOutlineSecurity />, 
      title: "Cybersecurity and Blockchain", 
      link: role === "admin" ? "admin/papers/category/Cybersecurity and Blockchain" : "evaluator/papers/category/Cybersecurity and Blockchain" 
    },
    { 
      icon: <BsRobot />, 
      title: "Robotics and Automation", 
      link: role === "admin" ? "admin/papers/category/Robotics and Automation" : "evaluator/papers/category/Robotics and Automation" 
    },
  ];

  return (
    <div>
      <Banner pageName="Home" title="Research Paper Tracks" />

      <div className="grid-container">
        <div className="item item1">
          <img src="Assets/Home.png" alt="Homepage" />
        </div>

        <div className="item item2">
          <h2 className="page-title">Conference Tracks</h2>
          <div className="tracks-grid">
            {tracks.map((track, index) => (
              <Link to={track.link} key={index} className="track-card">
                <span className="track-icon">{track.icon}</span>
                <p className="track-title">{track.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
