import React, { useEffect } from "react";
import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="refund-container">
      <div className="refund-section">
        <h2 className="ref-section-title">Our 7-Day Refund Policy</h2>
        <div className="section-content">
          <p>
            At Dream Jodi, we offer a strict 7-day refund policy from the date
            of your initial payment. All refunds will be processed to the
            original payment method.
          </p>

          <div className="highlight-box">
            <p>
              <strong>Note:</strong> Refund requests must be made within 7 days
              of transaction. Refunds will be issued to the original payment
              source within 3-5 business days after approval.
            </p>
          </div>
        </div>
      </div>

      <div className="refund-section">
        <h2 className="ref-section-title">Refund Conditions</h2>
        <div className="section-content">
          <div className="sub-section">
            <h3 className="sub-title">Eligible for Refund</h3>
            <ul className="refund-list">
              <li>Duplicate or incorrect payments</li>
              <li>Unauthorized transactions</li>
              <li>Technical errors from our system</li>
              <li>Requests made within 7 days of payment</li>
            </ul>
          </div>

          <div className="sub-section">
            <h3 className="sub-title">Not Eligible for Refund</h3>
            <ul className="refund-list">
              <li>Amounts used in gameplay or betting</li>
              <li>Transactions older than 7 days</li>
              <li>Bonuses or promotional amounts</li>
              <li>Suspected fraudulent activities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="refund-section">
        <h2 className="ref-section-title">Refund Process</h2>
        <div className="section-content">
          <div className="sub-section">
            <h3 className="sub-title">Step 1: Submit Request</h3>
            <p>
              Contact our support team via WhatsApp or Telegram with your
              transaction details.
            </p>
          </div>

          <div className="sub-section">
            <h3 className="sub-title">Step 2: Verification</h3>
            <p>
              Our team will verify your identity and transaction (24-48 hours).
            </p>
          </div>

          <div className="sub-section">
            <h3 className="sub-title">Step 3: Processing</h3>
            <p>
              Approved refunds are processed within 3-5 business days to your
              original payment method.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
