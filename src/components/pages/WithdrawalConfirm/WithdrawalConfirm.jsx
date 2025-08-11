import React from "react";
import "./WithdrawalStyles.css";
import { Link } from "react-router-dom";

const WithdrawalConfirm = () => {
  const upiId = "user@phonepe"; // This would typically come from props or state

  return (
    <div className="wc-container">
     
      
      <div className="wc-notice-box">
        <div className="wc-alert-icon">!</div>
        <p className="wc-notice-text">
         
          <strong className="Important">Important : </strong> निकासी केवल उसी यूपीआई आईडी पर की जाएगी जिससे जमा किया गया था।
        </p>
      </div>

      <div className="wc-card">
        <h2 className="wc-subtitle">Transaction Details / लेन-देन विवरण</h2>
        
        <div className="wc-detail-row">
          <span className="wc-detail-label">UPI ID:</span>
          <span className="wc-detail-value">{upiId}</span>
        </div>
        
        <div className="wc-detail-row">
          <span className="wc-detail-label">Processing Time:</span>
          <span className="wc-detail-value">5-10 minutes / 5-10 मिनट</span>
        </div>
      </div>
      
      <div className="wc-divider"></div>
      
      <div className="wc-card">
        <h3 className="wc-subsection-title">Payment Information / भुगतान जानकारी</h3>
        <div className="wc-note-box">
          <p className="wc-note-text">
            • Amount will be credited after admin approval
           
          </p>
        </div>
      </div>
      
      <Link to="/withdrawchips" className="wc-confirm-button">
        <span className="wc-button-text">Confirm Redeem</span>
        
      </Link>
    </div>
  );
};

export default WithdrawalConfirm;