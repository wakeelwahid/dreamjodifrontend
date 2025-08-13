import React, { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import "./panels.css";

const games = [
  "FARIDABAD",
  "JAIPUR KING",
  "GHAZIABAD",
  "DIAMOND KING",
  "GALI",
  "DISAWER",
];

const BetRecordsPanel = () => {
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [sessions, setSessions] = useState([]);
  const [currentIST, setCurrentIST] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBetRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // adminAxios already attaches token and baseURL from env
      const res = await adminAxios.get(
        `/admin/entry/?game=${encodeURIComponent(selectedGame)}`
      );
      const data = res.data;
      const selectedData = data[selectedGame];
      if (!selectedData || !Array.isArray(selectedData.sessions)) {
        setSessions([]);
        setLoading(false);
        return;
      }
      setSessions(selectedData.sessions);
      setCurrentIST(data.current_ist || null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized: Please login again.");
      } else {
        setError(err.message || "Failed to fetch bet records");
      }
      setSessions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBetRecords();
    // eslint-disable-next-line
  }, [selectedGame]);

  // Helper: get today's date in YYYY-MM-DD (from IST if available)
  const getToday = () => {
    let d;
    if (currentIST) {
      d = new Date(currentIST.replace(" ", "T") + "+05:30");
    } else {
      d = new Date();
    }
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Table row generator: Only show numbers where bet is placed, but serial wise
  const renderNumberRows = (bets) => {
    // Map for fast lookup
    const numberMap = {};
    const andarMap = {};
    const baharMap = {};
    const statusMap = {};
    const createdAtMap = {};

    bets.forEach((bet) => {
      // Number
      if (bet.number !== "" && bet.number !== undefined) {
        const num = bet.number.padStart(2, "0");
        numberMap[num] = (numberMap[num] || 0) + (bet.amount || 0);
        // Status and createdAt: show latest (optional, else keep as before)
        statusMap[num] = bet.status || "-";
        createdAtMap[num] = bet.created_at || "";
      }
      // Andar
      if (bet.andar_number !== "" && bet.andar_number !== undefined) {
        const num = bet.andar_number.padStart(2, "0");
        andarMap[num] = (andarMap[num] || 0) + (bet.andarAmount || 0);
        statusMap[num] = bet.status || "-";
        createdAtMap[num] = bet.created_at || "";
      }
      // Bahar
      if (bet.bahar_number !== "" && bet.bahar_number !== undefined) {
        const num = bet.bahar_number.padStart(2, "0");
        baharMap[num] = (baharMap[num] || 0) + (bet.baharAmount || 0);
        statusMap[num] = bet.status || "-";
        createdAtMap[num] = bet.created_at || "";
      }
    });

    // Collect all unique numbers where any bet is placed
    const allNumbers = new Set([
      ...Object.keys(numberMap),
      ...Object.keys(andarMap),
      ...Object.keys(baharMap),
    ]);

    // Sort numbers serial wise (00, 01, ..., 99)
    const sortedNumbers = Array.from(allNumbers).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    return sortedNumbers.map((num) => {
      const numberAmount = numberMap[num] || 0;
      const andarAmount = andarMap[num] || 0;
      const baharAmount = baharMap[num] || 0;
      const total = numberAmount + andarAmount + baharAmount;
      const status = statusMap[num] || "-";
      const createdAt = createdAtMap[num] || "-";
      // Highlight 0-10
      const highlightClass =
        parseInt(num, 10) >= 0 && parseInt(num, 10) <= 10
          ? "highlight-row"
          : "";
      return (
        <tr key={num} className={highlightClass}>
          <td>{num}</td>
          <td>₹{numberAmount}</td>
          <td>{num}</td>
          <td>₹{andarAmount}</td>
          <td>{num}</td>
          <td>₹{baharAmount}</td>
          <td>₹{total}</td>
          <td>{status}</td>
          <td>{createdAt}</td>
        </tr>
      );
    });
  };

  // No special session logic needed for DIAMOND KING anymore.

  return (
    <div className="panel bet-records-panel">
      <h2 className="panel-title">Entry Records</h2>
      <div className="bet-records-controls">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="game-select dark"
        >
          {games.map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>Loading bet records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {sessions.length === 0 && <p>No bet records found.</p>}

          {sessions.length > 0 &&
            sessions.map((session, idx) => {
              const bets = session.bets || [];
              let numberTotal = 0,
                andarTotal = 0,
                baharTotal = 0,
                totalAmount = 0;
              bets.forEach((bet) => {
                numberTotal += bet.amount || 0;
                andarTotal += bet.andarAmount || 0;
                baharTotal += bet.baharAmount || 0;
                totalAmount +=
                  (bet.amount || 0) +
                  (bet.andarAmount || 0) +
                  (bet.baharAmount || 0);
              });

              return (
                <div
                  className="session-block"
                  key={session.type + (session.session_no || session.date)}
                >
                  <div
                    className={`session-info ${
                      session.type === "current"
                        ? "session-info-current"
                        : "session-info-previous"
                    }`}
                    style={{ marginBottom: 8 }}
                  >
                    <strong>
                      {session.type === "current"
                        ? "Current Session"
                        : "Previous Session"}
                      {session.session_no ? ` #${session.session_no}` : ""}
                    </strong>
                    <span style={{ marginLeft: 10 }}>
                      Date: {getToday()} | Open: {session.open_time} | Close:{" "}
                      {session.close_time} | Result: {session.result_time}
                    </span>
                  </div>
                  <div
                    className="bet-records-summary"
                    style={{ marginBottom: 8 }}
                  >
                    <div className="summary-card">
                      <h3>Total Entries</h3>
                      <p>{bets.length}</p>
                    </div>
                    <div className="summary-card highlight">
                      <h3>Total Entry Amount</h3>
                      <p>₹{totalAmount}</p>
                    </div>
                    <div className="summary-card number-total">
                      <h3>Total Number Amount</h3>
                      <p>₹{numberTotal}</p>
                    </div>
                    <div className="summary-card andar">
                      <h3>Andar Total</h3>
                      <p>₹{andarTotal}</p>
                    </div>
                    <div className="summary-card bahar">
                      <h3>Bahar Total</h3>
                      <p>₹{baharTotal}</p>
                    </div>
                  </div>
                  <div className="bet-records-table">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Number</th>
                          <th>Number Amount</th>
                          <th>Andar Number</th>
                          <th>Andar Amount</th>
                          <th>Bahar Number</th>
                          <th>Bahar Amount</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Placed At</th>
                        </tr>
                      </thead>
                      <tbody>{renderNumberRows(bets)}</tbody>
                    </table>
                  </div>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};

export default BetRecordsPanel;
