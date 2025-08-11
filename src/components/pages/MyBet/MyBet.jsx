import React, { useEffect, useState } from "react";
import "./MyBet.css";
import axios from "axios";

const MyBet = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://127.0.0.1:8000/api/current-session/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Group by game + date
        const grouped = {};
        res.data.forEach((bet) => {
          const date = (bet.created_at || "").split("T")[0];
          const key = `${bet.game}|${date}`;
          if (!grouped[key]) {
            grouped[key] = {
              game: bet.game,
              date: date,
              status: bet.status || "pending",
              bets: [],
            };
          }
          grouped[key].bets.push(bet);
        });

        setBets(Object.values(grouped));
      } catch (error) {
        console.error("Fetch error:", error);
        setBets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  return (
    <>
      <div className="bet-logo">My Bets</div>

      <div className="my-container">
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : bets.length === 0 ? (
          <p style={{ textAlign: "center" }}>No Entry found.</p>
        ) : (
          bets.map((group, idx) => (
            <div className="bet-card" key={idx}>
              <div className="bet-header">
                <span className="bet-market">{group.game?.toUpperCase()}</span>
                <span className="bet-date">{group.date}</span>
              </div>

              <div className="bet-numbers bet-numbers-horizontal-scroll">
                {group.bets.map((bet, i) => (
                  <div
                    key={i}
                    className={`bet-number-chip ${
                      bet.bet_type === "andar"
                        ? "andar"
                        : bet.bet_type === "bahar"
                        ? "bahar"
                        : ""
                    }`}
                  >
                    {bet.number} ₹{bet.amount}
                    {bet.bet_type === "andar" && (
                      <span className="bet-section-mark">A</span>
                    )}
                    {bet.bet_type === "bahar" && (
                      <span className="bet-section-mark">B</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bet-footer">
                <span className="bet-status bet-status-pending">Pending</span>
                <span className="bet-amount">
                  Total Numbers: {group.bets.length}
                </span>
                <span className="bet-payout">
                  amount: ₹
                  {group.bets.reduce((sum, b) => sum + Number(b.amount), 0)}
                </span>
              </div>
            </div>
          ))
        )}

        <a href="/join" className="bet-back-btn">
          <i className="fas fa-arrow-left" /> Join
        </a>
      </div>
    </>
  );
};

export default MyBet;
