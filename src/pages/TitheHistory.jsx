// 📁 frontend/components/TithesHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const TithesHistory = () => {
  const [tithes, setTithes] = useState([]);
  const [filters, setFilters] = useState({
    memberName: "",
  });

  const fetchTithes = async () => {
    try {
      const params = new URLSearchParams(filters);
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/churchapp/tithes/history?${params.toString()}`
      );
      setTithes(data);
    } catch (err) {
      console.error("Error fetching tithes", err);
    }
  };

  useEffect(() => {
    fetchTithes();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchTithes();
  };

  return (
    <div className='tithes-history-page' style={{ padding: "20px" }}>
      <h2>📜 Tithes History</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type='text'
          name='memberName'
          value={filters.memberName}
          onChange={handleChange}
          placeholder='Search by Member Name'
        />
        <button onClick={handleSearch}>🔍 Search</button>
      </div>

      {tithes.length === 0 ? (
        <p>No tithes found for the given search.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Date
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Member
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Amount
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {tithes.map((tithe) => (
              <tr key={tithe._id}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {new Date(tithe.datePaid).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {tithe.memberId?.fullName ||
                    `${tithe.memberId?.firstName || ""} ${
                      tithe.memberId?.lastName || ""
                    }`}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  GH₵ {tithe.amount.toLocaleString()}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {tithe.note || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TithesHistory;
