import React from "react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import "./SupportPage.css";

const SupportPage = () => {
  return (
    <div className="support-page">
      <div className="support-options">
        {/* WhatsApp Support Card */}
        {/* <div className="support-card">
          <div className="support-icon whatsapp-icon">
            <FaWhatsapp size={40} />
          </div>
          <h2 className="support-card-title">WhatsApp Support</h2>
          <p className="support-card-desc">
            Get instant help from our support team via WhatsApp. We're available
            24 hours a day.
          </p>
          <a
            href="https://wa.me/7027019186"
            className="contact-btn whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp style={{ marginRight: "8px" }} /> Chat on WhatsApp
          </a>
        </div> */}

        {/* Telegram Support Card */}
        <div className="support-card">
          <div className="support-icon telegram-icon">
            <FaTelegram size={40} />
          </div>
          <h2 className="support-card-title">Telegram Support</h2>
          <p className="support-card-desc">
            Message us on Telegram for quick responses. Our team is always ready
            to help.
          </p>
          <a
            href="https://t.me/Helpdreamjodii" // Change this to your Telegram username
            className="contact-btn telegram-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram style={{ marginRight: "8px" }} /> Message on Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
