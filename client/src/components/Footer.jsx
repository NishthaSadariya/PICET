import React from "react";
import "../Styles/Footer.css"

import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      < div className="container"
         style={{
          backgroundImage: `url("/Assets/world-map-footer.png")`,
          backgroundSize: "65%", 
          backgroundPosition: "right top",
          backgroundRepeat: "no-repeat",
          filter:"brightness(100%)"
      }}
      >
        <div className="footer-section">
          <img src="/Assets/logo_picet.png" alt="PiCET" className="logo" />
          <p>
            The PiCET-2025 has an objective of creating an international forum
            for academicians, researchers, and scientists across the globe to
            discuss contemporary research status and advanced techniques to
            address challenges faced in emerging technologies in Engineering &
            its allied branches.
          </p>
          <div className="social-icons">
            <a href="https://www.instagram.com/paruluniversity/?hl=en"><IoLogoInstagram  fill="#0056b3"/></a>
            <a href="https://x.com/ParulUniversity?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"><RiTwitterFill fill="#0056b3"/></a>
            <a href="https://www.facebook.com/ParulUniversity/"><FaFacebook fill="#0056b3"/></a>
            <a href="https://www.linkedin.com/school/paruluniversity/posts/?feedView=all"><FaLinkedin fill="#0056b3"/></a>
          </div>
        </div>

        <div className="footer-section links">
          <h3>USEFUL LINKS</h3>
          <ul>
            <li><a href="/Home">Home</a></li>
            <li><a href="https://paruluniversity.ac.in/">Parul University</a></li>
            <li><a href="/view">View Papers</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>CONTACT US</h3>
          <p><strong>Parul University,</strong></p>
          <p>P.O. Limda, Ta. Waghodiya - 391760,</p>
          <p>District : Vadodara, Gujarat (India).</p>
          <br></br>
          <p><strong>Contact Person :</strong></p>
          <p>Mr. Mohit Rathod</p>
          <p>Contact No: <a href="tel:+91123" style={{fontWeight:"bold"}}>+91 123</a></p>
        </div>

        <div className="footer-section video">
        <iframe
            width="240"
            height="140"
            src="https://www.youtube.com/embed/Dbj2FEfc2Ds"
            title="Parul University Video"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; Copyright <strong>PIT CSE, Parul University.</strong> All Rights Reserved
        </p>
        <p>

          Designed and Developed by 
          <a href="https://www.linkedin.com/in/sujit-chavda/"> @Sujit Chavda</a>  
          <a href="https://www.linkedin.com/in/nishtha-sadariya-64514432a/">@Nishtha Sadariya </a> 
          <a href="https://www.linkedin.com/in/anjali-nikumbe-6a8a44282/">@Anjali Nikumbhe</a>  

        </p>
      </div>
    </footer>
  );
};

export default Footer;
