import React, { useState, useEffect } from "react";
import "./AddChips.css";

import { Link, useNavigate } from "react-router-dom";

const AddChips = () => {
  const [amount, setAmount] = useState("");
  const [bonus, setBonus] = useState(0);
  const [gst, setGst] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleAmountChange = (value) => {
    let val = parseInt(value, 10);
    if (isNaN(val)) val = "";
    if (val !== "" && (val < 100 || val > 1000)) return;
    setAmount(val);
    const gstAmount = parseFloat(val || 0) * 0.28;
    const bonusAmount = parseFloat(val || 0) * 0.05;
    setGst(gstAmount.toFixed(2));
    setBonus(bonusAmount.toFixed(2));
  };

  const handleUPISelect = (method) => {
    if (!amount || parseFloat(amount) < 100 || parseFloat(amount) > 1000) {
      setPopupMessage(
        "⚠️ Please enter amount between ₹100 and ₹1000 to continue."
      );
      return;
    }

    navigate("/payment", {
      state: {
        amount,
        paymentMethod: method,
      },
    });
  };

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  return (
    <div className="deposit-container">
      <div className="deposit-card">
        <h2 className="card-title">Add Coins</h2>

        <div className="form-group">
          {/* <label className="form-label">Deposit Amount (₹)</label> */}
          <input
            type="number"
            className="form-input"
            placeholder="Enter coins"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="100"
            max="1000"
            required
          />
        </div>
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
        <div className="amount-buttons">
          {[100, 200, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => handleAmountChange(amt)}
              className="amount-btn"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <div className="calculation-box">
          <div className="calculation-row">
            <span>Deposit Amount (Excl. Govt. Tax)</span>
            <span>₹{(amount - gst).toFixed(2)}</span>
          </div>
          <div className="calculation-row">
            <span>Govt. Tax (28% GST)</span>
            <span>₹{gst}</span>
          </div>
          <div className="calculation-row">
            <span>Cashback Bonus</span>
            <span>+₹{gst}</span>
          </div>
          <div className="calculation-row">
            <span>Total (A + B)</span>
            <span>₹{amount}</span>
          </div>
        </div>

        <div className="form-group">
          <button
            className="confirm-btn"
            onClick={() => {
              if (
                !amount ||
                parseFloat(amount) < 100 ||
                parseFloat(amount) > 1000
              ) {
                setPopupMessage(
                  "⚠️ Please enter amount between ₹100 and ₹1000 to continue."
                );
                return;
              }
              navigate("/purchasechips", {
                state: {
                  amount,
                },
              });
            }}
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="deposit-info">
        <h3>📌 Deposit Information:</h3>
        <ul>
          <li>Minimum deposit: ₹100</li>
          <li>Instant UPI deposits (Max ₹50,000)</li>
          <li>28% GST applicable on all deposits</li>
          <li>5% cashback on deposits above ₹2000</li>
          <li>Wallet balance updated after admin approval</li>
        </ul>
      </div>
    </div>
  );
};

export default AddChips;
