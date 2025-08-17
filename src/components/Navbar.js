import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">CodeMate</div>
      <div className="nav-links">
       
        <Link to="/dashboard">Dashboard</Link>
         
      </div>
    </nav>
  );
}

export default Navbar;
