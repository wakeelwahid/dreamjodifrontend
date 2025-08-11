import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Top_section.css";
import { Link } from "react-router-dom";

const TopSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="top-section-container">
      {/* Announcement Marquee */}
      {/* <div className="announcement-marquee">
        <marquee behavior="scroll" direction="left" scrollamount="5">
          <span className="marquee-item bonus">
            🎉 रेफर और 5000 बोनस पाएं! कोड: WELCOME500
          </span>
          <span className="marquee-item jackpot">
            💰 आज का जैकपॉट: ₹25,00,000
          </span>
          <span className="marquee-item new-game">
            🔥 नया गेम लॉन्च: डायमंड किंग
          </span>
          <span className="marquee-item special">
            ⭐ विशेष ऑफर: पहले डिपॉजिट पर 100% बोनस
          </span>
        </marquee>
      </div> */}

      {/* Info Boxes from Header */}
      <div className="header-info-section">
        <div className="info-boxes">
          <motion.div
            className="info-box"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="info-icon">💸</div>
            <div className="info-number">24x7</div>
            <div className="info-label">
              निकासी
              <br />
              किसी भी समय पैसा निकालें
            </div>
          </motion.div>

          <motion.div
            className="info-box highlight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="info-icon">⚡</div>
            <div className="info-number">5 मिनट</div>
            <div className="info-label">
              में भुगतान
              <br />
              सुपर फास्ट पेमेंट प्रोसेस
            </div>
          </motion.div>

          <motion.div
            className="info-box"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="info-icon">🛡️</div>
            <div className="info-number">24x7</div>
            <div className="info-label">
              सपोर्ट
              <br />
              हमेशा आपकी सेवा में
            </div>
          </motion.div>

          <motion.div
            className="info-box"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="info-icon">✅</div>
            <div className="info-number">100%</div>
            <div className="info-label">
              सुरक्षित
              <br />
              सुरक्षित और विश्वसनीय
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="gm-action-buttons">
          <button
            className="action-btn game-rules-btn"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
            }}
            onClick={() => navigate("/game-rules")}
          >
            <i className="fas fa-book"></i>
            <span>Game Rules</span>
          </button>

          <motion.button
            className="action-btn time-btn"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-clock"></i>
            {currentTime.toLocaleTimeString("en-IN", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </motion.button>

          <button
            className="action-btn view-result-btn"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
            }}
            onClick={() => navigate("/view-result")}
          >
            <i className="fas fa-chart-line"></i>
            <span>View Result</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
