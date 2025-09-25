import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import prof from "../assets/defaultProf.jpg";
import { FaTimes } from "react-icons/fa";
import "./ProfilePicture.css";

const ProfilePicture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { member } = location.state || {};

  return (
    <div className='profile-picture-container'>
      {/* Close Icon */}
      <FaTimes
        className='close-icon'
        onClick={() => navigate("/memberDetails", { state: { member } })}
      />

      {/* Profile Image */}
      <div className='profile-image-wrapper'>
        <img
          src={
            member?.profileImage
              ? `${import.meta.env.VITE_API_URL}/${member.profileImage}`
              : prof
          }
          alt='Profile'
          className='profile-image-large'
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
