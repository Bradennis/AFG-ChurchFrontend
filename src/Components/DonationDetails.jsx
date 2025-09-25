import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DonationDetails.css";
import { toast } from "react-toastify";

const DonationDetails = () => {
  const { state } = useLocation();
  const { selectedDonation } = state || {};
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedDonation, setEditedDonation] = useState(selectedDonation);

  if (!selectedDonation) {
    return <div>No data available for this date</div>;
  }

  const { _id, date, total, details, expenses } = selectedDonation;

  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/churchapp/donations/${_id}`);

      navigate("/donations");
      toast.success("record deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert("Failed to delete the donation.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3000/churchapp/donations/${_id}`,
        editedDonation
      );

      setIsEditing(false);
      toast.success("record updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error updating donation:", error);
      alert("Failed to update the donation.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("details.")) {
      const key = name.split(".")[1];
      setEditedDonation((prev) => ({
        ...prev,
        details: { ...prev.details, [key]: value },
      }));
    } else if (name.startsWith("expenses.")) {
      const index = name.split(".")[1];
      const key = name.split(".")[2];
      const updatedExpenses = [...editedDonation.expenses];
      updatedExpenses[index][key] = value;
      setEditedDonation((prev) => ({ ...prev, expenses: updatedExpenses }));
    } else {
      setEditedDonation((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className='donation-details-page'>
      <div className='editAndDelete'>
        {" "}
        <button className='edit-button' onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className='delete-button' onClick={handleDelete}>
          Delete
        </button>
      </div>
      <div className='donation-header'>
        <h2>Donation Details for {formattedDate}</h2>
      </div>

      {!isEditing ? (
        <>
          <div className='donation-summary'>
            <div className='summary-card'>
              <h3>
                Net Proceeds:{" "}
                <span className='amount'>GH¢ {total.toLocaleString()}</span>
              </h3>
            </div>

            <div className='offering-details'>
              <h4 className='section-title'>Offering Breakdown</h4>
              <ul>
                {Object.entries(details).map(([key, value]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                    <span className='amount'>GH¢ {value.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='expense-details'>
              <h4 className='section-title'>Expenses</h4>
              {expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <div key={index} className='expense-item'>
                    <div>
                      <strong>{expense.title}:</strong>{" "}
                      <span className='amount'>
                        GH¢ {expense.amount.toLocaleString()}
                      </span>{" "}
                    </div>
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      -{expense.description}
                    </p>
                  </div>
                ))
              ) : (
                <p>No expenses recorded for this date.</p>
              )}
            </div>
          </div>

          <button
            className='back-button'
            onClick={() => navigate("/donations")}
          >
            Back to Donations
          </button>
        </>
      ) : (
        <form className='donation-edit-form'>
          <h3>Edit Donation</h3>
          <label>Date:</label>
          <input
            type='date'
            name='date'
            value={editedDonation.date}
            onChange={handleChange}
          />
          <h4>Offering Breakdown:</h4>
          {Object.entries(editedDonation.details).map(([key, value]) => (
            <div key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                type='number'
                name={`details.${key}`}
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}
          <h4>Expenses:</h4>
          {editedDonation.expenses.map((expense, index) => (
            <div key={index}>
              <label>Title:</label>
              <input
                type='text'
                name={`expenses.${index}.title`}
                value={expense.title}
                onChange={handleChange}
              />
              <label>Amount:</label>
              <input
                type='number'
                name={`expenses.${index}.amount`}
                value={expense.amount}
                onChange={handleChange}
              />
              <label>Description:</label>
              <textarea
                style={{ whiteSpace: "pre-wrap" }}
                type='text'
                name={`expenses.${index}.description`}
                value={expense.description}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className='save-cancel-btns'>
            <button type='button' onClick={handleUpdate}>
              Save Changes
            </button>
            <button type='button' onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DonationDetails;
