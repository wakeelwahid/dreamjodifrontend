import React from "react";
import "./DepositStyles.css";
import { Link } from "react-router-dom";
import { color } from "framer-motion";

const DepositNotice = () => {
  return (
    <div className="dn-container">
    

      <div className="dn-notice-box">
        <div className="dn-alert-icon">!</div>
        <p className="dn-notice-text">
          <strong className="Important">Important : </strong>
           निकासी केवल उसी यूपीआई आईडी पर की जाएगी जिससे जमा किया गया था।
        </p>
      </div>

      <div className="dn-card">
        <h2 className="dn-subtitle">Add Coins Rules / जमा नियम</h2>
        <ul className="dn-list">
          <li className="dn-list-item">
            <span className="dn-list-icon">→</span>
            Redeem must go to the same UPI used for deposit (no changes allowed)
            <br />
            <span className="dn-hindi">निकासी उसी यूपीआई पर होगी जिससे जमा किया (कोई बदलाव नहीं)</span>
          </li>
          <li className="dn-list-item">
            <span className="dn-list-icon">→</span>
            Use only your own registered account
            <br />
            <span className="dn-hindi">केवल अपने पंजीकृत खाते का उपयोग करें</span>
          </li>
         
        </ul>
      </div>

      <div className="dn-info-box">
        <p className="dn-info-text">
          <strong>Note:</strong> For security reasons, we strictly enforce same-account withdrawals.
          
        </p>
      </div>

      <div className="dn-button-group">
        <Link to="/wallet" className="dn-button dn-button-cancel">
          <span className="dn-button-text">Cancel</span>
          <span className="dn-button-hindi">रद्द करें</span>
        </Link>
        <Link to="/addchips" className="dn-button dn-button-confirm">
          <span className="dn-button-text">Confirm</span>
          <span className="dn-button-hindi">पुष्टि करें</span>
        </Link>
      </div>
    </div>
  );
};

export default DepositNotice;