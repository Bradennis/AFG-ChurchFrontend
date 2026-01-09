import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const MemberStats = ({ memberId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [memberId]);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available.</p>;

  // Pie chart data
  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [stats?.present || 0, stats?.absent || 0],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Bar chart: attendance by type (optional if backend provides it)
  // Here we just show total attendance for demo purposes
  const barData = {
    labels: ["Attendance"],
    datasets: [
      {
        label: "Present",
        data: [stats?.present || 0],
        backgroundColor: "#4CAF50",
      },
      {
        label: "Absent",
        data: [stats?.absent || 0],
        backgroundColor: "#FF5733",
      },
    ],
  };

  // Chart options to ensure responsive rendering and readable axes/legend
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Member Attendance Statistics</h2>

      <div style={{ width: "400px", height: "300px", margin: "20px auto" }}>
        <h3>✅ Present vs ❌ Absent</h3>
        <Pie data={pieData} options={pieOptions} />
      </div>

      <div style={{ width: "600px", height: "350px", margin: "20px auto" }}>
        <h3>📊 Attendance Summary</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default MemberStats;
