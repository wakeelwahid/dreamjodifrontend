import React, { useState, useEffect } from "react";
import "./AgeVerification.css";

const AgeVerification = ({ onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasVerified = localStorage.getItem("ageVerified");
    const verifiedTime = localStorage.getItem("ageVerifiedTime");
    if (!hasVerified || !verifiedTime) {
      setIsVisible(true);
      return;
    }
    // Check if 48 hours (172800000 ms) have passed
    const now = Date.now();
    if (now - parseInt(verifiedTime, 10) > 172800000) {
      localStorage.removeItem("ageVerified");
      localStorage.removeItem("ageVerifiedTime");
      setIsVisible(true);
    } else {
      onConfirm();
    }
  }, [onConfirm]);

  const handleConfirm = () => {
    localStorage.setItem("ageVerified", "true");
    localStorage.setItem("ageVerifiedTime", Date.now().toString());
    setIsVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-popup">
        <div className="popup-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Age Verification Required</h2>
        <div className="warning-content">
          <p>
            <strong>Important Notice:</strong>
          </p>
          <ul>
            <li>This game can be addictive</li>
            <li>We are not responsible for any addiction or losses</li>
            <li>Play responsibly and within your limits</li>
          </ul>
        </div>
        <div className="confirmation-text">
          <p>
            By continuing, you confirm that you are 18+ years old and understand
            the risks involved.
          </p>
        </div>
        <div className="popup-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            <i className="fas fa-check"></i> I Confirm (18+)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
