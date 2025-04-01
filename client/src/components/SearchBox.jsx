import React from "react";
import "../Styles/SearchBox.css"
import { BiSearch } from "react-icons/bi"; 


const SearchBox = () => {
  return (
    <div>
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search here..."
          className="search-input"
        />
        <button className="search-btn">
          <BiSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
