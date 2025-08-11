import React, { useEffect, useState } from "react";
import "./BetSuccessPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BetSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game, numbers, amount } = location.state || {};
  const [ticket, setTicket] = useState("");
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  // useEffect(() => {
  //   setCurrentDateTime();
  //   createCoins();

  //   const interval = setInterval(() => {
  //     const coins = document.querySelectorAll(".coin");
  //     if (coins.length < 20) {
  //       createCoins();
  //     }
  //   }, 3000);

  //   const timeout = setTimeout(() => {
  //     navigate("/");
  //   }, 15000); // auto-redirect after 15 sec

  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(timeout);
  //   };
  // }, []);

  const generateTicketNumber = () => {
    const num = Math.floor(Math.random() * 90000) + 10000;
    setTicket(`SK2023${num}`);
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN");
    const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });
    setDateTime({ date: dateStr, time: timeStr });
  };

  const createCoins = () => {
    const container = document.getElementById("floating-coins");
    if (!container) return;

    const coinCount = 15;
    const coins = ["\uf155", "\uf51e", "\uf51d", "\uf0d6", "\uf3ff"];
    container.innerHTML = "";

    for (let i = 0; i < coinCount; i++) {
      const coin = document.createElement("i");
      coin.className = "coin fas";
      coin.innerHTML = coins[Math.floor(Math.random() * coins.length)];

      const size = Math.random() * 20 + 15;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 10;

      Object.assign(coin.style, {
        fontSize: `${size}px`,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      });

      container.appendChild(coin);
    }
  };

  return (
    <>
     

      <div className="bet-container">
        <div className="success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="success-title">ENTRY PLACED SUCCESSFULLY!</h1>

          <div className="ticket-id">
            ROUND : {" "}
            <span id="ticket-number">
              {game?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>

          <div className="bet-details">
            
            
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">₹{amount || "0"}</span>
            </div>
            
           
          </div>

          <div className="btn-container">
            <Link to="/join" className="btn btn-success">
              <i className="fas fa-play"></i> JOIN
            </Link>
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home"></i> HOME
            </Link>
          </div>
        </div>

      </div>

      
    </>
  );
};

export default BetSuccessPage;
