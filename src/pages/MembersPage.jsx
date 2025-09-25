import React, { useEffect, useState } from "react";
import "./MembersPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import prof from "../assets/defaultProf.jpg";

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [catClick, setCatClick] = useState("all");
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const membersPerPage = 5;

  const navigate = useNavigate();

  const fetchUsers = async (category = "all", search = "") => {
    try {
      const response = await axios.get(
        "https://afg-churchbackend.onrender.com/churchapp/tasks/getAllMembers",
        {
          params: {
            category,
            search,
          },
          // withCredentials: true,
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(catClick, searchTerm);
  }, [catClick, searchTerm]);

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const sortMembers = (field) => {
    const sortedMembers = [...members].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    setMembers(sortedMembers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className='members-page'>
      <header className='members-header'>
        <h1>Church Members</h1>
        <button
          className='add-member-btn'
          onClick={() => navigate("/add-member")}
        >
          + Add Member
        </button>
      </header>

      <div className='search-and-tabs'>
        <input
          type='text'
          placeholder='Search members...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='tabs-container'>
          {[
            { label: "All", value: "all" },
            { label: "Adults", value: "adults" },
            { label: "Under 18", value: "under18" },
          ].map((tab) => (
            <button
              key={tab.value}
              className={`tab ${catClick === tab.value ? "active" : ""}`}
              onClick={() => setCatClick(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <table className='members-table'>
        <thead>
          <tr>
            <th>Profile</th>
            <th onClick={() => sortMembers("fullName")}>
              Name <span>{sortOrder === "asc" ? "\u25B2" : "\u25BC"}</span>
            </th>
            <th>Contact</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.length > 0 ? (
            currentMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <img
                    src={
                      member.profileImage
                        ? `https://afg-churchbackend.onrender.com/${member.profileImage}`
                        : prof
                    }
                    alt='Profile'
                    className='profile-pic'
                  />
                </td>
                <td>
                  <Link
                    to={"/memberDetails"}
                    state={{ member }}
                    style={{ textDecoration: "none", color: "#284268" }}
                  >
                    {member.fullName}
                  </Link>
                </td>
                <td>{member.contact}</td>
                <td>{member.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4'>No members found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='pagination'>
        {Array.from(
          { length: Math.ceil(members.length / membersPerPage) },
          (_, index) => (
            <button
              key={index}
              className={`page-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default MembersPage;
