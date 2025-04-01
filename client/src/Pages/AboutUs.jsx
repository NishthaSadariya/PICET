import React from "react";
import Banner from "../components/Banner";
import "../Styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div>
      <Banner pageName="About" title="Know more about PICET" />

      <div className="picet-container">
        <div className="picet-content">
          <h2 className="about-title">ABOUT PICET</h2>
          <h2 className="picet-conference-title">
            Parul University International Conference on Engineering and
            Technology ( PiCET )
          </h2>
          <p className="para">
            PiCET-2025 is dedicated to establishing a global forum where
            academics, researchers, and scientists can come together to delve
            into the dynamic landscape of emerging technologies in Engineering
            and its allied branches. Our conference features distinguished
            keynote speakers, presentations of original research papers,
            engaging poster sessions, and in-depth technical discussions.
          </p>
          <p className="para">
            Furthermore, PiCET-2025 offers an invaluable platform for budding
            students and researchers to directly interact with subject matter
            experts, facilitating knowledge exchange and mentorship
            opportunities. Alongside academic discourse, the conference also
            opens doors for industries and institutions to exhibit their
            cutting-edge products, services, innovations, and research findings.
          </p>
          <p className="para">
            Building on the success of our previous editions, PiCET has
            consistently facilitated the exploration and analysis of evolving
            trends in Engineering, emphasizing the transition towards the 'Smart
            Engineering' era. Join us as we collectively shape the future of
            this exciting field.
          </p>
        </div>
        <div className="picet-videos">
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/s_VNqr8S5SQ"
            title="PiCET 2023 Conference"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/Dbj2FEfc2Ds"
            title="PiCET 2022 Conference"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
