import React, { useEffect, useState } from "react";
import adminAxios from "../../utils/adminAxios";
import "./panels.css";

const BetnumberHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await adminAxios.get("/admin/declare-result-history/");
        const formattedData = res.data.map((item) => ({
          ...item,
          date: item.date.split("T")[0], // keep only date part
        }));

        // Keep only first result per game per day
        const uniqueRecordsMap = {};
        const uniqueHistory = [];

        formattedData.forEach((item) => {
          const key = `${item.date}_${item.gameName}`;
          if (!uniqueRecordsMap[key]) {
            uniqueRecordsMap[key] = true;
            uniqueHistory.push(item);
          }
        });

        setHistory(uniqueHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistory([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="betnum-loading">Loading...</div>;

  const uniqueDates = [...new Set(history.map((item) => item.date))].sort().reverse();
  const uniqueGames = [...new Set(history.map((item) => item.gameName))].sort();

  return (
    <div className="betnum-panel">
      <h2 className="betnum-heading">Winning Numbers History</h2>

      <div className="betnum-table-container">
        <div className="betnum-table-wrapper">
          <table className="betnum-table">
            <thead>
              <tr>
                <th>Date</th>
                {uniqueGames.map((gameName, idx) => (
                  <th key={idx}>{gameName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uniqueDates.map((date, idx) => (
                <tr key={idx}>
                  <td>
                    {new Date(date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  {uniqueGames.map((gameName, gIdx) => {
                    const record = history.find(
                      (item) => item.date === date && item.gameName === gameName
                    );
                    return (
                      <td key={gIdx}>
                        {record ? (
                          <span className="winning-number">{record.winningNumber}</span>
                        ) : (
                          "-"
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

export default BetnumberHistory;
