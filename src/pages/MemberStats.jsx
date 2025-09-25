import React, { useEffect, useState } from "react";
import axios from "axios";

const MemberStats = ({ memberId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!memberId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/churchapp/attendance/memberStats/${memberId}`
        );
        setStats(data);
        setError("");
      } catch (err) {
        setError("Could not fetch stats. Please check Member ID.");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [memberId]);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return null;

  return (
    <div className='member-stats' style={{ padding: "10px" }}>
      <h4 style={{ marginBottom: "10px" }}>📊 Member Attendance Summary</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={cellStyle}>Total Meetings</td>
            <td style={cellStyle}>{stats.total}</td>
          </tr>
          <tr>
            <td style={cellStyle}>✔️ Present</td>
            <td style={cellStyle}>{stats.present}</td>
          </tr>
          <tr>
            <td style={cellStyle}>❌ Absent</td>
            <td style={cellStyle}>{stats.absent}</td>
          </tr>
          <tr>
            <td style={cellStyle}>📈 Attendance Rate</td>
            <td style={cellStyle}>{stats.percent}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  padding: "10px",
  border: "1px solid #ccc",
};

export default MemberStats;
