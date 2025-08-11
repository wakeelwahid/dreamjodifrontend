import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faWallet,
  faHome,
  faHistory,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import "./WithdrawalChipsSuccess.css";

const WithdrawalChipsSuccess = () => {
  const { state } = useLocation();

  const transactionId = state?.transactionId || `TXN${Date.now()}`;
  const amount = state?.amount || "0.00";
  const status = "Pending";

  return (
    <div className="withdrawal-success-page">
      <div className="success-container">
        <div className="success-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>

        <h1 className="success-title">Withdrawal Submitted!</h1>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{transactionId}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">₹{amount}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value success">{status}</span>
          </div>
        </div>

        <div className="success-buttons">
          <Link to="/join" className="success-btn home-btn">
            <FontAwesomeIcon icon={faPlay} /> Join
          </Link>
          <Link to="/wallet" className="success-btn history-btn">
            <FontAwesomeIcon icon={faHistory} /> View Wallet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalChipsSuccess;
