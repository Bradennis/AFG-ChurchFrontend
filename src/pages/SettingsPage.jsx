import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+123456789",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    alert("Profile updated successfully!");
  };

  const updatePassword = () => {
    if (password.new !== password.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
  };

  return (
    <div className='settings-page'>
      <h2>Account Settings</h2>

      {/* Profile Section */}
      <div className='settings-section'>
        <h3>
          <FaUser /> Profile Information
        </h3>
        <div className='settings-input'>
          <label>Name:</label>
          <input
            type='text'
            name='name'
            value={profile.name}
            onChange={handleProfileChange}
          />
        </div>
        <div className='settings-input'>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={profile.email}
            onChange={handleProfileChange}
          />
        </div>
        <div className='settings-input'>
          <label>Phone:</label>
          <input
            type='tel'
            name='phone'
            value={profile.phone}
            onChange={handleProfileChange}
          />
        </div>
        <button className='settings-btn' onClick={saveProfile}>
          <FaCheck /> Save Profile
        </button>
      </div>

      {/* Notifications Section */}
      <div className='settings-section'>
        <h3>
          <FaEnvelope /> Notification Preferences
        </h3>
        <div className='settings-checkbox'>
          <label>
            <input
              type='checkbox'
              name='email'
              checked={notifications.email}
              onChange={handleNotificationChange}
            />
            Email Notifications
          </label>
        </div>
        <div className='settings-checkbox'>
          <label>
            <input
              type='checkbox'
              name='sms'
              checked={notifications.sms}
              onChange={handleNotificationChange}
            />
            SMS Notifications
          </label>
        </div>
      </div>

      {/* Password Update Section */}
      <div className='settings-section'>
        <h3>
          <FaLock /> Change Password
        </h3>
        <div className='settings-input'>
          <label>Current Password:</label>
          <input
            type='password'
            name='current'
            value={password.current}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='settings-input'>
          <label>New Password:</label>
          <input
            type='password'
            name='new'
            value={password.new}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='settings-input'>
          <label>Confirm New Password:</label>
          <input
            type='password'
            name='confirm'
            value={password.confirm}
            onChange={handlePasswordChange}
          />
        </div>
        <button className='settings-btn' onClick={updatePassword}>
          <FaCheck /> Update Password
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
