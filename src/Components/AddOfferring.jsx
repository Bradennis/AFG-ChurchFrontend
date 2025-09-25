import React, { useState } from "react";
import "./AddOffering.css";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const AddOffering = () => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState({
    tithes: "",
    firstOffering: "",
    secondOffering: "",
    seedOffering: "",
    specialAppeal: "",
    selectedDate: "",
    welfare: "",
  });
  const [expenses, setExpenses] = useState([
    { title: "", amount: "", description: "" },
  ]);

  const handleOfferingChange = (e) => {
    setOfferings({ ...offerings, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (index, e) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][e.target.name] = e.target.value;
    setExpenses(updatedExpenses);
  };

  const addExpenseField = () => {
    setExpenses([...expenses, { title: "", amount: "", description: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (total, expense) => total + (Number(expense.amount) || 0),
      0
    );

    // Calculate total offerings
    const totalOfferings =
      Number(offerings.tithes) +
      Number(offerings.firstOffering) +
      Number(offerings.secondOffering) +
      Number(offerings.seedOffering) +
      Number(offerings.specialAppeal) +
      Number(offerings.welfare);

    // Prepare the data to be sent to the backend
    const donationData = {
      date: offerings.selectedDate,
      total: totalOfferings - totalExpenses, // Subtract expenses from the total offerings
      details: {
        tithes: offerings.tithes,
        firstOffering: offerings.firstOffering,
        secondOffering: offerings.secondOffering,
        seedOffering: offerings.seedOffering,
        specialAppeal: offerings.specialAppeal,
        welfare: offerings.welfare,
      },
      expenses: expenses,
    };

    try {
      // Send POST request to backend to add donation
      const response = await axios.post(
        "http://localhost:3000/churchapp/donations/addDonation",
        donationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Donation added:", response.data);
      navigate("/donations"); // Navigate back to the donations page
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
        {/* Offering Inputs */}
        <div className='offerings-section'>
          <div className='offering-split'>
            <div className='offering-cat'>
              <label>Select Date:</label>
              <input
                type='date'
                id='report-date'
                name='selectedDate'
                value={offerings.selectedDate}
                onChange={handleOfferingChange}
              />
            </div>
          </div>

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

          <h3
            style={{
              marginTop: "50px",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            Special Appeal
          </h3>
          <div className='offering-split'>
            <div className='offering-cat'>
              <label>Amount:</label>
              <input
                type='number'
                name='specialAppeal'
                value={offerings.specialAppeal}
                onChange={handleOfferingChange}
                placeholder='Enter amount for special appeal'
              />
            </div>
          </div>
        </div>

        <h3
          style={{
            marginTop: "50px",
            marginBottom: "10px",
            textTransform: "uppercase",
          }}
        >
          Welfare
        </h3>
        <div className='offering-split'>
          <div className='offering-cat'>
            <label>Amount:</label>
            <input
              type='number'
              name='welfare'
              value={offerings.welfare}
              onChange={handleOfferingChange}
              placeholder='Enter amount for welfare'
            />
          </div>
        </div>

        {/* Expense Inputs */}
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
                    marginBottom: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                  }}
                  type='text'
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
            className='add-expense-button'
            onClick={addExpenseField}
          >
            + Add Expense
          </button>
        </div>

        {/* Submit Button */}
        <button type='submit' className='add-offering-submit-button'>
          Submit Offerings and Expenses
        </button>
      </form>
    </div>
  );
};

export default AddOffering;
