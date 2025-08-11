import React, { useEffect, useState } from "react";
import "./GameHistory.css";
import axios from "axios";

const GameHistory = () => {
  const [bets, setBets] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [selectedGame, setSelectedGame] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const betsPerPage = 5;

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          alert("You are not logged in. Please login first.");
          return;
        }
        // Use correct API endpoint
        const res = await axios.get("/api/view-entry-history/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Grouping by game + timestamp
        const grouped = {};
        res.data.forEach((bet) => {
          const key = `${bet.game}|${bet.timestamp}`;
          if (!grouped[key]) {
            grouped[key] = {
              game: bet.game,
              timestamp: bet.timestamp,
              status: bet.status || "pending",
              winning_number: bet.winning_number || null,
              session_start: bet.session_start, // fix: add this
              session_end: bet.session_end, // fix: add this
              bets: [],
            };
          }
          grouped[key].bets.push(bet);
        });

        const betGroups = Object.values(grouped);
        setBets(betGroups);
        setFilteredBets(betGroups);
      } catch (error) {
        setBets([]);
        setFilteredBets([]);
        setLoading(false);
        // Show error to user
        alert(
          "Failed to fetch bet history. Check your login and try again.\n" +
            (error?.response?.data?.error || error.message)
        );
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  useEffect(() => {
    if (selectedGame === "all") {
      setFilteredBets(bets);
    } else {
      setFilteredBets(
        bets.filter((b) => b.game.toLowerCase() === selectedGame.toLowerCase())
      );
    }
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedGame, bets]);

  // Pagination logic
  const indexOfLastBet = currentPage * betsPerPage;
  const indexOfFirstBet = indexOfLastBet - betsPerPage;
  const currentBets = filteredBets.slice(indexOfFirstBet, indexOfLastBet);
  const totalPages = Math.ceil(filteredBets.length / betsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate color based on number
  const getNumberColor = (number) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F06292",
      "#7986CB",
      "#9575CD",
      "#64B5F6",
      "#4DB6AC",
      "#81C784",
      "#FFD54F",
      "#FF8A65",
      "#A1887F",
      "#90A4AE",
    ];
    return colors[number % colors.length];
  };

  return (
    <div className="game-history-container">
      <header className="history-header">
        <h1 className="history-title">ROUND HISTORY</h1>
       
      </header>

      <div className="filter-controls">
        <div className="filter-group">
          <span className="filter-label">Round:</span>
          <select
            className="filter-select"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <option value="all">All Round</option>
            <option value="JAIPUR KING">Jaipur King</option>
            <option value="GALI">Gali</option>
            <option value="DISAWER">Disawer</option>
            <option value="FARIDABAD">Faridabad</option>
            <option value="DIAMOND KING">Diamond King</option>
            <option value="GHAZIABAD">Ghaziabad</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="results-count">
            Showing {indexOfFirstBet + 1}-
            {Math.min(indexOfLastBet, filteredBets.length)} of{" "}
            {filteredBets.length} results
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your round history...</p>
        </div>
      ) : currentBets.length === 0 ? (
        <div className="no-results">
         
          <p>No Entries found for your selection</p>
          <button
            className="refresh-btn"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      ) : (
        currentBets.map((group, idx) => (
          <div className="game-card" key={idx}>
            <div className="game-header">
              <div className="game-info">
                <div className="game-name">{group.game?.toUpperCase()}</div>
              </div>
              <div className="game-date">
                <i className="fas fa-calendar-alt"></i>
                {new Date(group.session_start).toLocaleDateString()}
              </div>
            </div>

            <div
              className="game-numbers-container"
              style={{ overflowX: "auto", paddingBottom: 8 }}
            >
              <div
                className="game-numbers"
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: 12,
                  minHeight: 70,
                }}
              >
                {group.bets.map((bet, i) => {
                  const isAndar = bet.bet_type === "andar";
                  const isBahar = bet.bet_type === "bahar";
                  const isNumber = !isAndar && !isBahar;
                  const isWinning = group.winning_number === bet.number;
                  const numberColor = getNumberColor(bet.number);

                  return (
                    <div
                      key={i}
                      className={`number-ball ${isAndar ? "andar" : ""} ${
                        isBahar ? "bahar" : ""
                      } ${isWinning ? "winning-number" : ""}`}
                      style={{
                        backgroundColor: isWinning ? "#4CAF50" : numberColor,
                        transform: isWinning ? "scale(1.1)" : "scale(1)",
                        minWidth: 56,
                        minHeight: 56,
                        borderRadius: 16,
                        boxShadow: isWinning
                          ? "0 0 8px #4CAF50"
                          : "0 1px 4px #ccc",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: 18,
                        color: isWinning ? "#fff" : "#222",
                        position: "relative",
                        border: isWinning
                          ? "2px solid #388e3c"
                          : "1px solid #e0e0e0",
                        marginBottom: 2,
                      }}
                    >
                      <div className="number-value">{bet.number}</div>
                      {/* Only show badge for Andar/Bahar, not for number bets */}
                      {(isAndar || isBahar) && (
                        <div
                          className="bet-type-badge"
                          style={{
                            fontSize: 12,
                            color: "#fff",
                            background: isAndar ? "#1976d2" : "#d32f2f",
                            borderRadius: 6,
                            padding: "1px 6px",
                            marginTop: 2,
                          }}
                        >
                          {isAndar ? "A" : isBahar ? "B" : ""}
                        </div>
                      )}
                      {/* Show amount more clearly, with color */}
                      <div
                        className="bet-amount"
                        style={{
                          fontSize: 15,
                          color: isWinning ? "#fff" : "#1976d2",
                          marginTop: 4,
                          fontWeight: 700,
                        }}
                      >
                        ₹{bet.amount}
                      </div>
                      {/* Only show crown for winning bets */}
                      {isWinning && (
                        <div
                          className="winning-crown"
                          style={{
                            position: "absolute",
                            top: -12,
                            right: -8,
                            color: "#FFD700",
                            fontSize: 20,
                          }}
                        >
                          <i className="fas fa-crown"></i>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="game-summary">
              <div className="summary-item">
                <span className="summary-label">Total Entry Amount :</span>
                <span className="summary-value highlight">
                  ₹{group.bets.reduce((sum, b) => sum + Number(b.amount), 0)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={i}
                className={`page-btn ${
                  currentPage === pageNum ? "active" : ""
                }`}
                onClick={() => paginate(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className={`page-btn ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHistory;
