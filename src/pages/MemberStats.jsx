import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const MemberStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/churchapp/attendance/stats"
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  // Pie Chart Data (Present vs Absent)
  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [stats.presentCount, stats.absentCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Bar Chart Data (Attendance per Meeting Type)
  const barData = {
    labels: Object.keys(stats.byMeetingType),
    datasets: [
      {
        label: "Attendance by Meeting Type",
        data: Object.values(stats.byMeetingType),
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
