import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCoins,
  faHistory,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import "./AddChipsSuccess.css";

const AddChipsSuccess = () => {
  const location = useLocation();
  const { amount, transactionId, upi_id } = location.state || {};

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div
          className="success-icon"
          style={{ width: 60, height: 60, margin: "0 auto" }}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ fontSize: 48, width: 48, height: 48 }}
          />
        </div>

        <h1 className="success-title">Payment Submitted!</h1>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Transaction ID (UTR):</span>
            <span className="detail-value">
              {transactionId || "TXN123456789"}
            </span>
          </div>
          {upi_id && (
            <div className="detail-item">
              <span className="detail-label">UPI ID:</span>
              <span className="detail-value">{upi_id}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">₹{amount || "0.00"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value success">Pending Approval</span>
          </div>
        </div>

        <div className="success-buttons">
          <Link to="/join" className="success-btn home-btn">
            <FontAwesomeIcon icon={faDice} /> Join
          </Link>
          <Link to="/transactions" className="success-btn history-btn">
            <FontAwesomeIcon icon={faHistory} /> View Wallet History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddChipsSuccess;
