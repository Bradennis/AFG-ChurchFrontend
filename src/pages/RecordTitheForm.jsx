import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecordTitheForm.css";

const RecordTitheForm = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    datePaid: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/tasks/getAllMembers`
        );
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/churchapp/tithes/record`,
        formData
      );
      setMessage("✅ Tithe recorded successfully.");
      setFormData({
        memberId: "",
        amount: "",
        datePaid: new Date().toISOString().split("T")[0],
        note: "",
      });
    } catch (err) {
      console.error("Error submitting tithe:", err);
      setMessage("❌ Failed to record tithe.");
    }
  };

  return (
    <div className='record-tithe-container'>
      <h2>💰 Record Member Tithe</h2>
      {/* <Link to='/tithes/record'>
        <button>Member Tithe Histories</button>
      </Link> */}

      <form onSubmit={handleSubmit} className='tithe-form'>
        <div className='form-group'>
          <label>Member:</label>
          <select
            name='memberId'
            value={formData.memberId}
            onChange={handleChange}
            required
          >
            <option value=''>-- Select Member --</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName || `${m.firstName} ${m.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <label>Amount (GHS):</label>
          <input
            type='number'
            name='amount'
            value={formData.amount}
            onChange={handleChange}
            required
            min={0}
          />
        </div>

        <div className='form-group'>
          <label>Date Paid:</label>
          <input
            type='date'
            name='datePaid'
            value={formData.datePaid}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label>Note (optional):</label>
          <textarea
            name='note'
            value={formData.note}
            onChange={handleChange}
            rows={3}
            placeholder='e.g. Paid during Sunday service'
          />
        </div>

        <button type='submit'>📥 Record Tithe</button>
        {message && <p className='feedback'>{message}</p>}
      </form>
    </div>
  );
};

export default RecordTitheForm;
