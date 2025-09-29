// src/pages/AttendancePage.jsx
import React, { useEffect, useRef, useState } from "react";
import "./AttendancePage.css";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000/churchapp";
axios.defaults.withCredentials = true;

const AttendancePage = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [newType, setNewType] = useState("Sunday Service");
  const [newDate, setNewDate] = useState("");

  // NEW: query date for downloading specific day
  const [queryDate, setQueryDate] = useState("");

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const nameColRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      const res = await axios.get("/attendance/records");
      const {
        members: backendMembers = [],
        meetings: backendMeetings = [],
        attendance: backendAttendance = {},
      } = res.data;

      const cleanedMembers = backendMembers.map((m) => ({
        id: m.id || m._id || String(m._id),
        fullName: m.fullName,
      }));

      setMembers(cleanedMembers);
      setMeetings(backendMeetings || []);
      setAttendance(backendAttendance || {});
    } catch (err) {
      console.error("Failed to load initial data:", err);
      alert("Failed to load attendance data. Check console.");
    }
  }

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleBodyScroll = () => {
    if (headerRef.current && bodyRef.current && nameColRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      nameColRef.current.scrollTop = bodyRef.current.scrollTop;
    }
  };

  const toggleAttendance = async (memberId, date, meetingType) => {
    const cur = attendance[memberId]?.[date] || "";
    const newStatusSymbol = cur === "✔️" ? "❌" : cur === "❌" ? "" : "✔️";
    const newStatus =
      newStatusSymbol === "✔️"
        ? "present"
        : newStatusSymbol === "❌"
        ? "absent"
        : "";

    try {
      await axios.patch("/attendance/toggle", {
        memberId,
        meetingDate: date,
        meetingType,
        status: newStatus,
      });

      setAttendance((prev) => ({
        ...prev,
        [memberId]: {
          ...prev[memberId],
          [date]: newStatusSymbol,
        },
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. See console.");
    }
  };

  const handleAddRecord = async () => {
    if (!newDate || !newType) {
      return alert("Please choose date and type");
    }
    const exists = meetings.find(
      (m) => m.date === newDate && m.type === newType
    );
    if (exists) return alert("Meeting already exists");

    try {
      const res = await axios.post("/attendance/add", {
        date: newDate,
        type: newType,
      });
      setMeetings((prev) => [...prev, res.data]);

      setAttendance((prev) => {
        const updated = { ...prev };
        members.forEach((m) => {
          if (!updated[m.id]) updated[m.id] = {};
          updated[m.id][newDate] = "";
        });
        return updated;
      });

      setNewDate("");
      setNewType("Sunday Service");
    } catch (err) {
      console.error("Failed to create meeting:", err);
      alert("Failed to add meeting. See console.");
    }
  };

  const handleSaveAttendanceBulk = async (meeting) => {
    const records = members.map((m) => {
      const sym = attendance[m.id]?.[meeting.date] || "";
      return {
        "Full Name": m.fullName,
        "Meeting Type": meeting.type,
        Status: sym || "Not marked",
      };
    });

    try {
      await axios.post("/attendance/save", {
        meetingDate: meeting.date,
        meetingType: meeting.type,
        records,
      });
      alert("Saved meeting attendance");
    } catch (err) {
      console.error("Bulk save error:", err);
      alert("Failed to save. See console.");
    }
  };

  const downloadMeetingExcel = (meeting) => {
    const rows = members.map((m) => {
      const sym = attendance[m.id]?.[meeting.date] || "";
      return {
        "Full Name": m.fullName,
        "Meeting Type": meeting.type,
        Status: sym || "Not marked",
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf]),
      `${meeting.type.replace(/\s+/g, "_")}_${meeting.date}.xlsx`
    );
  };

  const downloadAllAsExcel = () => {
    const headings = [
      "Full Name",
      ...meetings.map((m) => `${m.type} (${m.date})`),
    ];
    const rows = members.map((m) => {
      const row = { "Full Name": m.fullName };
      meetings.forEach((mt) => {
        const sym = attendance[m.id]?.[mt.date] || "";
        row[`${mt.type} (${mt.date})`] = sym || "Not marked";
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows, { header: headings });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf]),
      `attendance_all_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // NEW: download attendance for a specific date
  const handleDownload = (date, type) => {
    const url = `http://localhost:5000/churchapp/attendance/export?date=${date}&type=${type}`;
    window.open(url, "_blank");
  };

  return (
    <div className='attendance-container'>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <button
          className='attendance-nav-btn'
          onClick={() => navigate("/attendance-reports")}
        >
          View Attendance Reports
        </button>
        <button
          className='attendance-nav-btn'
          onClick={() => navigate("/attendance-summary")}
        >
          View Attendance Summary
        </button>
      </div>
      <h2>📋 Attendance Overview</h2>

      <div className='new-record-form'>
        <input
          type='date'
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
        <select value={newType} onChange={(e) => setNewType(e.target.value)}>
          <option>Sunday Service</option>
          <option>Prayer Meeting</option>
          <option>Bible Study</option>
          <option>Youth Fellowship</option>
          <option>Special Event</option>
        </select>
        <button onClick={handleAddRecord}>+ Add New Record</button>
        <button onClick={downloadAllAsExcel}>📥 Download All</button>
      </div>

      {/* NEW: Query attendance by date */}
      {/* NEW: Query attendance by date and type */}
      <div className='query-form'>
        <input
          type='date'
          value={queryDate}
          onChange={(e) => setQueryDate(e.target.value)}
        />

        <select
          value={newType} // reuse same state or create separate state if you want
          onChange={(e) => setNewType(e.target.value)}
        >
          <option>Sunday Service</option>
          <option>Prayer Meeting</option>
          <option>Bible Study</option>
          <option>Youth Fellowship</option>
          <option>Special Event</option>
        </select>

        <button
          onClick={() => {
            if (!queryDate || !newType) {
              alert("Please select both date and type");
              return;
            }
            handleDownload(queryDate, newType);
          }}
        >
          📥 Download For Date & Type
        </button>
      </div>

      <div className='search-bar-wrapper'>
        <input
          className='search-bar'
          placeholder='🔍 Search member name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className='attendance-table-wrapper'>
        <div className='top-row'>
          <div className='sticky-header-left'>Full Name</div>
          <div className='records-header' ref={headerRef}>
            {meetings.map((meeting, i) => (
              <div key={i} className='record-cell header'>
                <strong>{meeting.type}</strong>
                <br />
                <span className='date'>{meeting.date}</span>
                <br />
                <div style={{ marginTop: 6 }}>
                  <button
                    title='Download meeting'
                    onClick={() => downloadMeetingExcel(meeting)}
                  >
                    📥
                  </button>
                  <button
                    title='Save meeting'
                    onClick={() => handleSaveAttendanceBulk(meeting)}
                    style={{ marginLeft: 6 }}
                  >
                    💾
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='attendance-scroll-body'>
          <div className='left-column' ref={nameColRef}>
            {filteredMembers.map((member) => (
              <div key={member.id} className='name-cell'>
                {member.fullName}
              </div>
            ))}
          </div>

          <div
            className='right-scrollable'
            ref={bodyRef}
            onScroll={handleBodyScroll}
          >
            {filteredMembers.map((member) => (
              <div key={member.id} className='record-row'>
                {meetings.map((meeting, i) => {
                  const sym = attendance[member.id]?.[meeting.date] || "";
                  return (
                    <div
                      key={i}
                      className={`record-cell ${
                        sym === "✔️" ? "present" : sym === "❌" ? "absent" : ""
                      }`}
                      onClick={() =>
                        toggleAttendance(member.id, meeting.date, meeting.type)
                      }
                    >
                      {sym}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
