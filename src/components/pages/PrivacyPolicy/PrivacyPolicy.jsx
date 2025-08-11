import React, { useEffect } from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-section">
        <h2 className="ref-section-title">Data Collection</h2>
        <div className="section-content">
          <p>We collect the following information to provide our services:</p>

          <ul className="privacy-list">
            <li>
              <strong>Personal Details:</strong> Name, contact information, date
              of birth
            </li>
            <li>
              <strong>Payment Information:</strong> Transaction history and
              payment methods
            </li>
            <li>
              <strong>Round Activity:</strong> Entries placed, results, and account
              balance
            </li>
            <li>
              <strong>Device Information:</strong> IP address, browser type, and
              operating system
            </li>
          </ul>

          <div className="warning-box">
            <p>
              <strong>Note:</strong> We never store your complete payment
              details. All transactions are processed through secure payment
              gateways.
            </p>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <h2 className="ref-section-title">Cookies & Tracking</h2>
        <div className="section-content">
          <div className="sub-section">
            <h3 className="sub-title">Essential Cookies</h3>
            <p>Required for website functionality and account security.</p>
          </div>

          <div className="sub-section">
            <h3 className="sub-title">Analytics Cookies</h3>
            <p>Help us understand how players use our platform.</p>
          </div>

          <div className="sub-section">
            <h3 className="sub-title">Advertising Cookies</h3>
            <p>Used to show relevant promotions and offers.</p>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <h2 className="ref-section-title">Data Security</h2>
        <div className="section-content">
          <p>We implement multiple security measures:</p>

          <ul className="privacy-list">
            <li>256-bit SSL encryption for all data transfers</li>
            <li>Regular security audits and penetration testing</li>
            <li>Two-factor authentication for account access</li>
            <li>Secure tokenization for payment processing</li>
          </ul>
        </div>
      </div>

      <div className="privacy-section">
        <h2 className="ref-section-title">Third-Party Sharing</h2>
        <div className="section-content">
          <p>We may share data with:</p>

          <ul className="privacy-list">
            <li>Payment processors for transaction completion</li>
            <li>Regulatory authorities as required by law</li>
            <li>Service providers assisting with platform operations</li>
          </ul>

          <div className="warning-box">
            <p>
              <strong>Important:</strong> We never sell your personal data to
              third-party marketers.
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default PrivacyPolicy;
