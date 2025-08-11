import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="satta-footer">
      <hr />
      {/* Flower Bubble Animation */}
      <div className="flower-bubbles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble" />
        ))}
      </div>

      {/* Copyright & Disclaimer */}
      <div className="footer-bottom">
        <p>
          © 2025 <span>Dream Jodi</span>. All Rights Reserved.
        </p>
        <p className="disclaimer">
          Disclaimer: This website is for entertainment purposes only. Context
          is illegal in many jurisdictions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
