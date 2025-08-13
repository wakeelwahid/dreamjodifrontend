import React, { useState, useEffect } from "react";
import "./WithdrawChips.css";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/axiosSetup";

const WithdrawChips = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [upi, setUpi] = useState("");
  const [lastDepositUpi, setLastDepositUpi] = useState("");

  useEffect(() => {
    // Fetch last deposit UPI from backend
    const fetchLastDeposit = async () => {
      try {
        const res = await API.get("/user-upimatch/");
        setLastDepositUpi(res.data.upi_id || "");
      } catch (e) {
        setLastDepositUpi("");
      }
    };
    fetchLastDeposit();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount.");
      return;
    }
    if (parseInt(amount) < 100) {
      setError("Minimum withdrawal amount is ₹100.");
      return;
    }
    if (parseInt(amount) > 30000) {
      setError(
        "Maximum withdrawal limit is ₹30,000. You cannot withdraw above ₹30,000 in a single request."
      );
      return;
    }
    if (!upi.trim()) {
      setError("Please enter your UPI ID.");
      return;
    }
    if (upi.trim() !== lastDepositUpi.trim()) {
      setError(
        "UPI MisMatch"
      );
      return;
    }

    try {
      const res = await API.post("/withdraw/", {
        amount: parseFloat(amount),
        upi_id: upi.trim(),
      });

      setSuccess(
        res.data.message || "Withdraw request submitted successfully!"
      );
      setAmount("");
      setUpi("");
      navigate("/withdrawalchipssuccess", { state: { amount } });
    } catch (err) {
      setError(
        err.response?.data?.error || "❌ Withdrawal failed. Please try again."
      );
    }
  };

  return (
    <div className="withdraw-container">
      <div className="withdraw-card">
        <h2 className="card-title">Redeem Coins</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              required
              min={100}
              max={30000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="amount-buttons">
            {[100, 500, 1000, 2000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                type="button"
                className="amount-btn"
                onClick={() => setAmount(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Enter UPI ID"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              required
            />
            {error && (
            <div
              className="form-error"
              style={{ color: "red", marginBottom: 8 }}
            >
              {error}
            </div>
          )}
            <p style={{ marginTop: "5px" }}>
              <span style={{ color: "red" }}>नोट: </span> 
              आपने जिस UPI ID से आखिरी बार जमा किया था, उसी UPI मे विड्रॉ (withdraw) होगा।
            </p>
          </div>
          
          {success && (
            <div
              className="form-success"
              style={{ color: "green", marginBottom: 8 }}
            >
              {success}
            </div>
          )}
          <button type="submit" className="submit-btn">
            REQUEST COINS
          </button>
        </form>
      </div>

      <div className="withdrawal-info">
        <h3>ℹ️ Withdrawal Information:</h3>
        <ul>
          <li>Processing time: 5 to 10 minutes</li>
          <li>Bank charges may apply</li>
        </ul>
      </div>
    </div>
  );
};

export default WithdrawChips;
