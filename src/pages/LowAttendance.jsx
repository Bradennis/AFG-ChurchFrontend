// LowAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LowAttendance = () => {
  const [lowAttendanceList, setLowAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowAttendance = async () => {
      try {
        const { data } = await axios.get(
          "https://afg-churchbackend.onrender.com/churchapp/attendance/lowAttendance"
        );
        setLowAttendanceList(data);
      } catch (err) {
        console.error("Failed to fetch low attendance members", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowAttendance();
  }, []);

  if (loading) return <p>Loading low attendance members...</p>;

  return (
    <div className='low-attendance-container' style={{ padding: "20px" }}>
      <h3>🚨 Members with Low Attendance from the past 5 meetings</h3>

      {lowAttendanceList.length === 0 ? (
        <p>No members with low attendance.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Full Name
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Attendance Rate
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Present
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Absent
              </th>
            </tr>
          </thead>
          <tbody>
            {lowAttendanceList.map((member) => (
              <tr key={member._id}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {member.fullName || `${member.firstName} ${member.lastName}`}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {member.attendanceRate}%
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {member.present}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {member.absent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LowAttendance;
