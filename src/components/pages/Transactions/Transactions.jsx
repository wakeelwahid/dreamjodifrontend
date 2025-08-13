import React, { useEffect, useState } from "react";
import API from "../../../api/axiosSetup";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Status highlight helper
  const getStatusClass = (status) => {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s === "pending") return "status-pending";
    if (s === "approved" || s === "completed") return "status-approved";
    if (s === "rejected") return "status-rejected";
    return "";
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions/");
        // Remove duplicate transactions by unique id (if backend sends multiple for same request)
        const txMap = new Map();
        res.data.forEach((tx) => {
          // Use tx.id or tx.related_withdraw/related_deposit or a unique field from backend
          const uniqueKey = tx.related_withdraw || tx.related_deposit || tx.id;
          // Always keep the latest (by created_at)
          if (
            !txMap.has(uniqueKey) ||
            new Date(tx.created_at) > new Date(txMap.get(uniqueKey).created_at)
          ) {
            txMap.set(uniqueKey, tx);
          }
        });
        const formatted = Array.from(txMap.values()).map((tx) => {
          let dateObj = null;
          if (tx.created_at) {
            const [datePart, timePart] = tx.created_at.split(" ");
            const [day, month, year] = datePart.split("-");
            let [hour, minute] = timePart.split(":");
            let ampm = tx.created_at.slice(-2);
            hour = parseInt(hour, 10);
            if (ampm === "PM" && hour < 12) hour += 12;
            if (ampm === "AM" && hour === 12) hour = 0;
            dateObj = new Date(
              `${year}-${month}-${day}T${hour
                .toString()
                .padStart(2, "0")}:${minute}:00`
            );
          }
          return {
            id: tx.id,
            dateObj,
            date: dateObj
              ? dateObj.toLocaleDateString("en-IN")
              : tx.created_at || "",
            time: dateObj ? dateObj.toLocaleTimeString("en-IN") : "",
            type: tx.type,
            amount:
              (tx.type === "deposit" || tx.type === "win" || tx.type === "bonus"
                ? "+"
                : "-") + `₹${tx.amount}`,
            status: tx.status
              ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
              : "Completed",
          };
        });
        setTransactions(formatted);
      } catch (error) {
        // handle error
      }
    };
    fetchTransactions();
  }, []);

  // Show only last 15 transactions by default
  const filteredTransactions = showAll
    ? transactions
    : transactions.slice(0, 15);

  return (
    <div className="transactions-container">
      <div className="transactions-content">
        <div className="transaction-card">
          <h2 className="card-title">Wallet History</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search transactions..."
              className="search-input"
            />
            <button
              className="show-all-btn"
              style={{ marginLeft: "10px" }}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Last 15" : "Show All"}
            </button>
          </div>
          <div
            className="table-container"
            style={{ maxHeight: "350px", overflowY: "auto" }}
          >
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {transaction.date} / <span>{transaction.time}</span>
                    </td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>
                      <span className={getStatusClass(transaction.status)}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
