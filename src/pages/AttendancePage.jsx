import React, { useEffect, useRef, useState } from "react";
import "./AttendancePage.css";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

axios.defaults.baseURL = "http://localhost:3000/churchapp";
axios.defaults.withCredentials = true;

const AttendancePage = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [newType, setNewType] = useState("Sunday Service");
  const [newDate, setNewDate] = useState("");

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const nameColRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resMembers = await axios.get("/tasks/getAllMembers");
        const cleanedMembers = resMembers.data.map((m) => ({
          id: m._id,
          fullName: m.fullName || `${m.firstName} ${m.lastName}`,
        }));
        setMembers(cleanedMembers);

        const resMeetings = await axios.get("/attendance/getAllMeetings");
        setMeetings(resMeetings.data);

        const resAttendance = await axios.get("/attendance/getAll");
        const attendanceMap = {};
        resAttendance.data.forEach(({ memberId, meetingDate, status }) => {
          if (!attendanceMap[memberId]) attendanceMap[memberId] = {};
          attendanceMap[memberId][meetingDate] = status;
        });
        setAttendance(attendanceMap);
      } catch (err) {
        console.error("❌ Failed to load initial data:", err);
        alert("Could not load members, meetings, or attendance.");
      }
    };

    fetchInitialData();
  }, []);

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleBodyScroll = () => {
    if (headerRef.current && bodyRef.current && nameColRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      nameColRef.current.scrollTop = bodyRef.current.scrollTop;
    }
  };

  const toggleAttendance = async (memberId, date) => {
    const current = attendance[memberId]?.[date] || "";
    const newStatus = current === "✔️" ? "❌" : current === "❌" ? "" : "✔️";

    try {
      await axios.patch("/attendance/toggleStatus", {
        memberId,
        meetingDate: date,
        status: newStatus,
      });

      setAttendance((prev) => ({
        ...prev,
        [memberId]: {
          ...prev[memberId],
          [date]: newStatus,
        },
      }));
    } catch (err) {
      console.error("❌ Failed to update attendance:", err);
      alert("Failed to update attendance. Check console.");
    }
  };

  const handleAddRecord = async () => {
    if (!newDate || !newType) return alert("Please enter both type and date");

    const exists = meetings.find(
      (m) => m.date === newDate && m.type === newType
    );
    if (exists) return alert("This attendance record already exists");

    try {
      const res = await axios.post("/attendance/addRecord", {
        date: newDate,
        type: newType,
      });

      setMeetings((prev) => [...prev, res.data]);
      setNewDate("");
      setNewType("Sunday Service");

      console.log("Meeting saved:", res.data);
    } catch (err) {
      console.error("Error saving meeting:", err);
      alert("Failed to save meeting. Check console.");
    }
  };

  const downloadMeetingExcel = (meeting) => {
    const data = members.map((member) => {
      const status = attendance[member.id]?.[meeting.date] || "";
      return {
        "Full Name": member.fullName,
        Status: status || "Not Marked",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meeting Attendance");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const filename = `${meeting.type.replace(/\s+/g, "_")}_${
      meeting.date
    }.xlsx`;
    saveAs(file, filename);
  };

  return (
    <div className='attendance-container'>
      <h2>📋 Attendance Overview</h2>

      <div className='new-record-form'>
        <input
          type='date'
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]} // ⛔️ No future dates
        />

        <select value={newType} onChange={(e) => setNewType(e.target.value)}>
          <option>Sunday Service</option>
          <option>Prayer Meeting</option>
          <option>Bible Study</option>
          <option>Youth Fellowship</option>
          <option>Special Event</option>
        </select>
        <button onClick={handleAddRecord}>+ Add New Record</button>
      </div>

      <div className='search-bar-wrapper'>
        <input
          type='text'
          placeholder='🔍 Search member name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='search-bar'
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
                <button
                  className='download-btn'
                  onClick={() => downloadMeetingExcel(meeting)}
                  title='Download this meeting attendance'
                >
                  📥
                </button>
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
                  const status = attendance[member.id]?.[meeting.date] || "";
                  return (
                    <div
                      key={i}
                      className={`record-cell ${
                        status === "✔️"
                          ? "present"
                          : status === "❌"
                          ? "absent"
                          : ""
                      }`}
                      onClick={() => toggleAttendance(member.id, meeting.date)}
                    >
                      {status}
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
