import { useEffect, useState } from "react";
import AttendanceSummaryChart from "./AttendanceSummaryChart";
import MemberStats from "./MemberStats";
import axios from "axios";
import Select from "react-select";
import LowAttendance from "./LowAttendance";

const AttendanceReportsPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/churchapp/tasks/getAllMembers")
      .then((res) => {
        const options = res.data.map((m) => ({
          value: m._id,
          label: `${m.fullName || `${m.firstName} ${m.lastName}`} - ${
            m.contact
          }`,
          searchableText: `${m.fullName || m.firstName + " " + m.lastName} ${
            m.contact
          }`,
        }));
        setMembers(options);
      })
      .catch((err) => console.error("Failed to fetch members", err));
  }, []);

  // Custom filter: allows searching by contact too
  const customFilter = (option, inputValue) => {
    return option.data.searchableText
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  };

  return (
    <div className='attendance-reports-page' style={{ padding: "20px" }}>
      <h2>📈 Attendance Analytics Dashboard</h2>

      <section style={{ marginBottom: "40px" }}>
        <h3>🗓️ Attendance Summary</h3>
        <AttendanceSummaryChart />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h3>🚨 Low Attendance Alerts</h3>
        <LowAttendance />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h3>🙋 Member Stats</h3>
        <div style={{ maxWidth: "400px", marginBottom: "20px" }}>
          <Select
            options={members}
            value={selectedMember}
            onChange={(option) => setSelectedMember(option)}
            placeholder='Search by name or phone number...'
            isClearable
            filterOption={customFilter}
          />
        </div>

        {selectedMember && <MemberStats memberId={selectedMember.value} />}
      </section>
    </div>
  );
};

export default AttendanceReportsPage;
