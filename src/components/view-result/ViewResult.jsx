import React, { useEffect, useState } from "react";
import axios from "../../api/axiosSetup";
import { motion } from "framer-motion";
import "./ViewResult.css";

const GAME_NAMES = [
  "FARIDABAD",
  "JAIPUR KING",
  "GHAZIABAD",
  "GALI",
  "DIAMOND KING",
  "DISAWER",
];

function groupResultsByDate(results) {
  const grouped = {};
  results.forEach((item) => {
    const date = item.date;
    const game = item.gameName ? item.gameName.toUpperCase() : "";
    if (!grouped[date]) grouped[date] = {};
    grouped[date][game] = item.winningNumber;
  });
  return grouped;
}

const ViewResult = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios
      .get("/result-history/", { headers })
      .then((res) => {
        setResults(res.data);
        if (res.data.length > 0) {
          const sorted = [...res.data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setLatest(sorted[0]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="no-results">
        <p>No results available for the last month</p>
      </div>
    );
  }

  const grouped = groupResultsByDate(results);
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let currentGame = latest ? latest.gameName : "";
  let currentNumber = latest ? latest.winningNumber : "";
  let currentDate = latest ? latest.date : "";

  return (
    <div className="view-result-container">
      <div className="header-section">
        <h2 className="section-title">Winning Numbers History</h2>
        {latest && (
          <motion.div
            className="current-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="current-label">LATEST RESULT</p>
            <div className="current-game-display">
              <span className="game-name">{currentGame}</span>
              <motion.div
                className="jackpot-number"
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                {currentNumber}
              </motion.div>
            </div>
            <p className="current-date">
              {new Date(currentDate).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </motion.div>
        )}
      </div>

      <div className="results-table-container">
        <div className="table-scroll-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th className="date-column" style={{backgroundColor:"red"}}>Date</th>
                {GAME_NAMES.map((game) => (
                  <th key={game} style={{backgroundColor:"red"}}>{game}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDates.map((date, index) => (
                <tr
                  key={date}
                  className={`excel-row ${
                    index % 2 === 0 ? "excel-row-even" : "excel-row-odd"
                  } ${index === 0 ? "latest-row" : ""}`} 
                >
                  <td className="date-column" >
                    {new Date(date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {GAME_NAMES.map((game) => {
                    const value = grouped[date][game] || "-";
                    return (
                      <td key={game}>
                        {value !== "-" ? (
                          <span className="winning-number">{value}</span>
                        ) : (
                          <span className="no-result">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewResult;
