import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChartPie, FaDonate, FaPlus, FaSearch } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./DonationsPage.css";

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DonationsPage = () => {
  const [donationsData, setDonationsData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Format date function
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          "https://afg-churchbackend.onrender.com/churchapp/donations",
          {
            params: searchTerm ? { date: searchTerm } : {},
          }
        );
        setDonationsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [searchTerm]);

  // Calculate overall proceeds and expenses
  const totalProceeds = donationsData.reduce((sum, d) => sum + d.total, 0);
  const totalExpenses = donationsData.reduce(
    (sum, donation) =>
      sum +
      donation.expenses.reduce((subSum, expense) => subSum + expense.amount, 0),
    0
  );

  // Prepare chart data
  const chartData = {
    labels: donationsData.map((donation) => formatDate(donation.date)), // Labels are donation dates
    datasets: [
      {
        label: "Net Proceeds",
        data: donationsData.map((donation) => donation.total), // Net proceeds data
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Expenses",
        data: donationsData.map((donation) =>
          donation.expenses.reduce((sum, expense) => sum + expense.amount, 0)
        ), // Expenses data
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleDateClick = (date) => {
    const selectedDonation = donationsData.find(
      (donation) => donation.date === date
    );
    navigate(`/donation-details/${date}`, { state: { selectedDonation } });
  };

  return (
    <div className='donations-page'>
      <div className='header'>
        <h1>Donations & Offerings</h1>
        <p>Track and manage all offerings and expenses seamlessly.</p>
      </div>
      <div className='content'>
        <div className='search-bar'>
          <input
            type='date'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search by date'
          />
          <button className='search-button'>
            <FaSearch /> Search
          </button>
        </div>
        {isAdmin ? (
          <>
            <div className='table-section'>
              <table className='donations-table'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Net Proceeds</th>
                  </tr>
                </thead>
                <tbody>
                  {donationsData.length > 0 ? (
                    donationsData.map((donation) => (
                      <tr
                        key={donation._id}
                        onClick={() => handleDateClick(donation.date)}
                      >
                        <td>{formatDate(donation.date)}</td>
                        <td>GH¢ {donation.total.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='2'>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='summary-section'>
              <div className='summary-card'>
                <h3>Overall Proceeds</h3>
                <p>GH¢ {totalProceeds.toLocaleString()}</p>
              </div>
              <div className='summary-card'>
                <h3>Overall Expenses</h3>
                <p>GH¢ {totalExpenses.toLocaleString()}</p>
              </div>
            </div>

            {/* Graphical data trends */}
            <div className='chart-section'>
              <h3>Proceeds & Expenses Trends</h3>
              <Bar
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>

            <div className='actions-section'>
              <button onClick={() => navigate("/add-offering")}>
                <FaPlus /> Record New Proceeds
              </button>
              <button onClick={() => navigate("/payment")}>
                <FaDonate /> Give Offering
              </button>
            </div>
          </>
        ) : (
          <div className='non-admin-view'>
            <h3 style={{ color: "#183c73" }}>Make a Contribution</h3>
            <div className='payment-options'>
              <div className='payment-card'>
                <h3 style={{ color: "#183c73" }}>Give Your Offering</h3>
                <p style={{ color: "#183c73" }}>
                  Support the church with your donations.
                </p>
                <button onClick={() => navigate("/payment")}>Contribute</button>
              </div>
              <div className='payment-card'>
                <h3 style={{ color: "#183c73" }}>Special Appeals</h3>
                <p style={{ color: "#183c73" }}>
                  Help us reach our goals for special projects.
                </p>
                <button onClick={() => navigate("/special-appeals")}>
                  Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsPage;
