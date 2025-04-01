import React from "react";
import "../Styles/Banner.css"

const Banner = ({pageName,title}) =>{
    return(
        <div className="banner">
            {/* pageName and title takes dynamic input */}
            <p className="bannercrumb">{pageName}</p>
            <p className="banner-title">{title}</p>
        </div>
    );
};

export default Banner;