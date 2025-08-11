import React, { useState, useEffect } from "react";
import Boxes from "../../Boxes/Boxes";
import WhatsAppButton from "../../WhatsAppButton/WhatsAppButton";
import GameTimeTable from "../../GameTimeTable/GameTimeTable";
import "./Dashboard.css";

const Dashboard = () => {
  const [walletBalance, setWalletBalance] = useState(1000.0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const statsCards = [
    {
      icon: "💰",
      title: "24x7",
      subtitle: "निकासी",
      description: "कभी भी पैसे निकालें",
      color: "#FFD700",
    },
    {
      icon: "⚡",
      title: "5 मिनट",
      subtitle: "में",
      description: "त्वरित पेआउट करे",
      color: "#FF6B35",
    },
    {
      icon: "🛡️",
      title: "24x7",
      subtitle: "सपोर्ट",
      description: "हमेशा सहायता उपलब्ध",
      color: "#4ECDC4",
    },
    {
      icon: "📈",
      title: "100%",
      subtitle: "सुरक्षित",
      description: "पूर्ण सुरक्षा गारंटी",
      color: "#45B7D1",
    },
  ];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-avatar">
            <span className="crown-icon">👑</span>
          </div>
          <div className="user-details">
            <h2 className="user-name">Dream Jodi</h2>
            <p className="user-subtitle">भारत का नम्बर 1 गेमिंग प्लेटफॉर्म</p>
          </div>
        </div>
        <div className="wallet-balance">
          <div className="balance-container">
            <span className="currency-symbol">₹</span>
            <span className="balance-amount">{walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Jackpot Section */}
      <div className="jackpot-section">
        <div className="jackpot-info">
          <span className="jackpot-icon">🎯</span>
          <span className="jackpot-text">आज का जैकपॉट: </span>
          <span className="jackpot-amount">₹25,00,000</span>
        </div>
        <div className="next-game-info">
          <span className="next-game-icon">🎮</span>
          <span className="next-game-text">नया गेम शुरू</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ "--card-color": card.color }}
          >
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-content">
              <div className="stat-title">{card.title}</div>
              <div className="stat-subtitle">{card.subtitle}</div>
              <div className="stat-description">{card.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn game-rules-btn">
          <span className="btn-icon">📋</span>
          Game Rules
        </button>
        <button className="action-btn current-time-btn">
          <span className="btn-icon">🕐</span>
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </button>
        <button className="action-btn view-result-btn">
          <span className="btn-icon">🏆</span>
          View Result
        </button>
      </div>

      {/* Game Cards Section */}
      <div className="games-section">
        <Boxes />
      </div>

      <GameTimeTable />
      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;
