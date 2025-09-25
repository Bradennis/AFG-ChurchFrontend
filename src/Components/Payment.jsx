import React, { useState } from "react";
import "../Components/Payment.css";
import momo from "../assets/momo.png";
import mastercard from "../assets/mastercard.jpg";
import visa from "../assets/visacard.jpg";
import bank from "../assets/bank.png";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("");

  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    // Handle payment logic
    alert(`Payment made via ${paymentMethod}`);
  };

  return (
    <div className='payment-page'>
      <div
        style={{ position: "absolute", right: "20px", cursor: "pointer" }}
        onClick={() => navigate("/donations")}
      >
        <FaTimes />
      </div>
      <div className='payment-page-heading'>
        <h2>Send an Offering</h2>
        <p>
          Choose from the following payment methods to complete your transaction
        </p>
      </div>

      {/* Payment Method Cards */}
      <div className='cards'>
        <div
          className={`single-card ${paymentMethod === "momo" ? "active" : ""}`}
          onClick={() => setPaymentMethod("momo")}
        >
          <img src={momo} alt='Mobile Money' />
        </div>

        <div
          className={`single-card mascards ${
            paymentMethod === "card" ? "active" : ""
          }`}
          onClick={() => setPaymentMethod("card")}
        >
          <div className='imgs'>
            <img src={mastercard} alt='MasterCard' />
          </div>
          <div className='imgs'>
            <img src={visa} alt='Visa' />
          </div>
        </div>

        <div
          className={`single-card ${paymentMethod === "bank" ? "active" : ""}`}
          onClick={() => setPaymentMethod("bank")}
        >
          <img src={bank} alt='Bank Transfer' />
          {/* <p>Bank Transfer</p> */}
        </div>
      </div>
      <div className='methods'>
        <p>momo</p>
        <p>visa/ mastercard</p>
        <p>bank transfer</p>
      </div>

      {/* Payment Form */}
      <form className='payment-form' onSubmit={handlePayment}>
        {paymentMethod === "momo" && (
          <div className='momo-fields'>
            <h3>Mobile Money Payment</h3>
            <label>
              Mobile Money Number:
              <input
                type='text'
                placeholder='Enter your mobile money number'
                required
              />
            </label>
            <label>
              Amount:
              <input type='number' placeholder='Enter amount' required />
            </label>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className='card-fields'>
            <h3>Credit/Debit Card Payment</h3>
            <label>
              Card Number:
              <input
                type='text'
                placeholder='Enter your card number'
                required
              />
            </label>
            <label>
              Expiry Date:
              <input type='text' placeholder='MM/YY' required />
            </label>
            <label>
              CVV:
              <input type='text' placeholder='Enter CVV' required />
            </label>
            <label>
              Amount:
              <input type='number' placeholder='Enter amount' required />
            </label>
          </div>
        )}

        {paymentMethod === "bank" && (
          <div className='bank-fields'>
            <h3>Bank Transfer Payment</h3>
            <label>
              Account Number:
              <input
                type='text'
                placeholder='Enter your bank account number'
                required
              />
            </label>
            <label>
              Bank Name:
              <input type='text' placeholder='Enter your bank name' required />
            </label>
            <label>
              Amount:
              <input type='number' placeholder='Enter amount' required />
            </label>
          </div>
        )}

        {paymentMethod && (
          <button type='submit' className='submit-button'>
            Make Payment
          </button>
        )}
      </form>
    </div>
  );
};

export default Payment;
