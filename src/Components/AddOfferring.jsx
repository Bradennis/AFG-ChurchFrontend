import React, { useState } from "react";
import "./AddOffering.css";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddOffering = () => {
  const navigate = useNavigate();

  // Offering fields
  const [offerings, setOfferings] = useState({
    tithes: "",
    firstOffering: "",
    secondOffering: "",
    seedOffering: "",
    specialAppeal: "",
    welfare: "",
    selectedDate: "",
  });

  // Expenses fields
  const [expenses, setExpenses] = useState([
    { title: "", amount: "", description: "" },
  ]);

  // Handle offerings input
  const handleOfferingChange = (e) => {
    setOfferings({ ...offerings, [e.target.name]: e.target.value });
  };

  // Handle expenses input
  const handleExpenseChange = (index, e) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][e.target.name] = e.target.value;
    setExpenses(updatedExpenses);
  };

  // Add new expense field
  const addExpenseField = () => {
    setExpenses([...expenses, { title: "", amount: "", description: "" }]);
  };

  // Submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all offering fields are numbers, default 0
    const safeOfferings = {};
    for (const key in offerings) {
      if (key !== "selectedDate") {
        safeOfferings[key] = Number(offerings[key]) || 0;
      }
    }

    // Ensure expenses have numeric amounts defaulting to 0
    const safeExpenses = expenses.map((exp) => ({
      title: exp.title || "",
      amount: Number(exp.amount) || 0,
      description: exp.description || "",
    }));

    // Calculate total offerings and expenses
    const totalOfferings = Object.values(safeOfferings).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalExpenses = safeExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Prepare data for backend
    const donationData = {
      date: offerings.selectedDate,
      total: totalOfferings - totalExpenses,
      details: safeOfferings,
      expenses: safeExpenses,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/churchapp/donations/addDonation`,
        donationData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Donation added:", response.data);
      navigate("/donations");
    } catch (error) {
      console.error("Error adding donation:", error);
      alert("There was an error adding the donation.");
    }
  };

  return (
    <div className='add-offering-page'>
      <div
        style={{ position: "absolute", right: "20px", cursor: "pointer" }}
        onClick={() => navigate("/donations")}
      >
        <FaTimes />
      </div>

      <h2>Record Offerings and Expenses</h2>

      <form onSubmit={handleSubmit}>
        {/* Date selection */}
        <div className='offerings-section'>
          <div className='offering-cat'>
            <label>Select Date:</label>
            <input
              type='date'
              name='selectedDate'
              value={offerings.selectedDate}
              onChange={handleOfferingChange}
              required
            />
          </div>

          {/* Offerings */}
          <div className='offering-split'>
            <div className='offering-cat'>
              <label>Tithes:</label>
              <input
                type='number'
                name='tithes'
                value={offerings.tithes}
                onChange={handleOfferingChange}
                placeholder='Enter amount for tithes'
              />
            </div>
            <div className='offering-cat'>
              <label>First Offering:</label>
              <input
                type='number'
                name='firstOffering'
                value={offerings.firstOffering}
                onChange={handleOfferingChange}
                placeholder='Enter amount for first offering'
              />
            </div>
          </div>

          <div className='offering-split'>
            <div className='offering-cat'>
              <label>Second Offering:</label>
              <input
                type='number'
                name='secondOffering'
                value={offerings.secondOffering}
                onChange={handleOfferingChange}
                placeholder='Enter amount for second offering'
              />
            </div>
            <div className='offering-cat'>
              <label>Seed Offering:</label>
              <input
                type='number'
                name='seedOffering'
                value={offerings.seedOffering}
                onChange={handleOfferingChange}
                placeholder='Enter amount for seed offering'
              />
            </div>
          </div>

          <div className='offering-cat'>
            <label>Special Appeal:</label>
            <input
              type='number'
              name='specialAppeal'
              value={offerings.specialAppeal}
              onChange={handleOfferingChange}
              placeholder='Enter amount for special appeal'
            />
          </div>

          <div className='offering-cat'>
            <label>Welfare:</label>
            <input
              type='number'
              name='welfare'
              value={offerings.welfare}
              onChange={handleOfferingChange}
              placeholder='Enter amount for welfare'
            />
          </div>
        </div>

        {/* Expenses */}
        <div className='expenses-section'>
          <h3>Expenses</h3>
          {expenses.map((expense, index) => (
            <div key={index} className='expense-item'>
              <div className='offering-cat'>
                <label>Expense Title:</label>
                <input
                  type='text'
                  name='title'
                  value={expense.title}
                  onChange={(e) => handleExpenseChange(index, e)}
                  placeholder='Enter expense title'
                />
              </div>

              <div className='offering-cat'>
                <label>Amount:</label>
                <input
                  type='number'
                  name='amount'
                  value={expense.amount}
                  onChange={(e) => handleExpenseChange(index, e)}
                  placeholder='Enter amount'
                />
              </div>

              <div className='offering-cat'>
                <label>Description:</label>
                <textarea
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                  name='description'
                  value={expense.description}
                  onChange={(e) => handleExpenseChange(index, e)}
                  placeholder='Enter description'
                />
              </div>
            </div>
          ))}

          <button
            type='button'
            onClick={addExpenseField}
            className='add-expense-button'
          >
            + Add Expense
          </button>
        </div>

        {/* Submit */}
        <button type='submit' className='add-offering-submit-button'>
          Submit Offerings and Expenses
        </button>
      </form>
    </div>
  );
};

export default AddOffering;
