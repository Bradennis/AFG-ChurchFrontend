import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";

const MemberStats = ({ memberId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!memberId) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/churchapp/attendance/stats/${memberId}`
        );
        setStats(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [memberId]);

  if (!stats) return <p>Loading stats...</p>;

  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [stats.presentCount, stats.absentCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(stats.byMeetingType || {}),
    datasets: [
      {
        label: "Attendance by Meeting Type",
        data: Object.values(stats.byMeetingType || {}),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Member Attendance Statistics</h2>

      <div style={{ width: "400px", margin: "20px auto" }}>
        <h3>✅ Present vs ❌ Absent</h3>
        <Pie data={pieData} />
      </div>

      <div style={{ width: "600px", margin: "20px auto" }}>
        <h3>📅 Attendance by Meeting Type</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default MemberStats;
