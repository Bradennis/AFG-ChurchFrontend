import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaCog,
  FaUsers,
  FaHandHoldingUsd,
  FaCalendarPlus,
  FaFileAlt,
  FaArrowLeft,
} from "react-icons/fa";
import "./Sidebar.css";
import { GlobalContext } from "../Context/ContextApi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setIsAuthenticated } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false); // Collapse the sidebar on mobile
    }
  };

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <div className='toggle-btn' onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobile && !isOpen ? "mobile-hidden" : ""
        }`}
      >
        <ul className='menu'>
          <li>
            <Link to={"/"} onClick={handleLinkClick}>
              <FaHome /> {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to={"/members"} onClick={handleLinkClick}>
              <FaUsers /> {!isCollapsed && <span>Members</span>}
            </Link>
          </li>
          <li>
            <Link to={"/donations"} onClick={handleLinkClick}>
              <FaHandHoldingUsd /> {!isCollapsed && <span>Proceeds</span>}
            </Link>
          </li>
          <li>
            <Link to={"/events"} onClick={handleLinkClick}>
              <FaCalendarPlus /> {!isCollapsed && <span>Events</span>}
            </Link>
          </li>
          <li>
            <Link to={"/reports"} onClick={handleLinkClick}>
              <FaFileAlt /> {!isCollapsed && <span>Reports</span>}
            </Link>
          </li>
        </ul>

        <ul className='menu' style={{ marginTop: "70px" }}>
          <li>
            <Link to={"/settings"} onClick={handleLinkClick}>
              <FaCog /> {!isCollapsed && <span>Settings</span>}
            </Link>
          </li>
          <li>
            <button
              className='logout-button'
              onClick={handleLogout}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaArrowLeft /> {!isCollapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
