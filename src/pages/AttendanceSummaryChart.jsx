// src/pages/AttendanceSummaryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/churchapp`;
axios.defaults.withCredentials = true;

const AttendanceSummaryPage = () => {
  const [members, setMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [attendance, setAttendance] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      const res = await axios.get("/attendance/records");
      const { members: m, meetings: mt, attendance: att } = res.data;
      setMembers(m);
      setMeetings(mt);
      setAttendance(att);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      alert("Could not fetch attendance summary.");
    }
  }

  const downloadAllExcel = () => {
    const headings = [
      "Full Name",
      ...meetings.map((m) => `${m.type} (${m.date})`),
    ];

    const rows = members.map((mem) => {
      const row = { "Full Name": mem.fullName };
      meetings.forEach((mt) => {
        const sym = attendance[mem.id]?.[mt.date] || "Not marked";
        row[`${mt.type} (${mt.date})`] = sym;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows, { header: headings });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf]),
      `attendance_summary_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/attendance")}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        ← Back to Attendance
      </button>

      <h2>📊 Full Attendance Summary</h2>
      <button
        onClick={downloadAllExcel}
        style={{
          background: "green",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        📥 Download Excel
      </button>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        {/* <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Full Name
              </th>
              {meetings.map((mt, i) => (
                <th
                  key={i}
                  style={{ padding: "8px", border: "1px solid #ddd" }}
                >
                  {mt.type} <br />
                  <small>{mt.date}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((mem) => (
              <tr key={mem.id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {mem.fullName}
                </td>
                {meetings.map((mt, i) => {
                  const sym = attendance[mem.id]?.[mt.date] || "";
                  return (
                    <td
                      key={i}
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid #ddd",
                        color:
                          sym === "✔️"
                            ? "green"
                            : sym === "❌"
                            ? "red"
                            : "gray",
                        fontWeight: sym ? "bold" : "normal",
                      }}
                    >
                      {sym || "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default AttendanceSummaryPage;
