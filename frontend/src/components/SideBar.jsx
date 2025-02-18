import React, { useState, useEffect } from "react";
import { Link,  useLocation } from "react-router-dom";
import { FaBars, FaTicketAlt, FaListAlt, FaSignOutAlt } from "react-icons/fa";
import "../css/SideBar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); 

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>
      <nav>
        <Link to="/create-ticket" className="sidebar-item">
          <FaTicketAlt className="sidebar-icon" />
          <span>Create Ticket</span>
        </Link>
        <Link to="/mytickets" className="sidebar-item">
          <FaListAlt className="sidebar-icon" />
          <span>Ticket List</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-item logout">
          <FaSignOutAlt className="sidebar-icon" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
