import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [emailNotification, setEmailNotification] = useState(true);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const saveProfile = async () => {
    await axios.put(
      "http://localhost:5000/churchapp/settings/profile",
      profile,
      { withCredentials: true }
    );
    alert("Profile updated successfully");
  };

  const saveNotification = async () => {
    await axios.put(
      "http://localhost:5000/churchapp/settings/notifications",
      { email: emailNotification },
      { withCredentials: true }
    );
    alert("Notification preference saved");
  };

  const updatePassword = async () => {
    try {
      if (password.new !== password.confirm) {
        return alert("Passwords do not match");
      }

      await axios.put(
        "http://localhost:5000/churchapp/settings/password",
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        { withCredentials: true }
      );

      alert("Password updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Account Settings
      </Typography>

      {/* Profile */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6'>Profile Information</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          fullWidth
          label='Name'
          margin='normal'
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <TextField
          fullWidth
          label='Email'
          margin='normal'
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <TextField
          fullWidth
          label='Phone'
          margin='normal'
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
        <Button variant='contained' onClick={saveProfile}>
          Save Profile
        </Button>
      </Card>

      {/* Email Notifications */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6'>Notifications</Typography>
        <Divider sx={{ my: 2 }} />
        <FormControlLabel
          control={
            <Switch
              checked={emailNotification}
              onChange={(e) => setEmailNotification(e.target.checked)}
            />
          }
          label='Receive Email Notifications'
        />
        <Button variant='contained' onClick={saveNotification}>
          Save Preference
        </Button>
      </Card>

      {/* Password */}
      <Card sx={{ p: 3 }}>
        <Typography variant='h6'>Change Password</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          fullWidth
          type='password'
          label='Current Password'
          margin='normal'
          onChange={(e) =>
            setPassword({ ...password, current: e.target.value })
          }
        />
        <TextField
          fullWidth
          type='password'
          label='New Password'
          margin='normal'
          onChange={(e) => setPassword({ ...password, new: e.target.value })}
        />
        <TextField
          fullWidth
          type='password'
          label='Confirm New Password'
          margin='normal'
          onChange={(e) =>
            setPassword({ ...password, confirm: e.target.value })
          }
        />
        <Button color='error' variant='contained' onClick={updatePassword}>
          Update Password
        </Button>
      </Card>
    </Box>
  );
};

export default SettingsPage;
