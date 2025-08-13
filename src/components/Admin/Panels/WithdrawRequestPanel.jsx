// Helper to parse 'DD-MM-YYYY HH:mm:ss' to Date object
function parseDateTime(str) {
  if (!str) return null;
  // Try ISO parse first
  let d = new Date(str);
  if (!isNaN(d)) return d;
  // Try DD-MM-YYYY HH:mm:ss
  const match = str.match(/(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const [_, day, month, year, hour, min, sec] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}`);
  }
  return null;
}
import React, { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import "./panels.css";

const WithdrawRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [actionType, setActionType] = useState("");
  const [message, setMessage] = useState(null); // { type: 'approve' | 'reject', text: string }

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await adminAxios.get("/admin/redeem-requests/");
      // Only show pending withdrawals in this panel
      const pendingWithdrawals = res.data.filter(
        (withdraw) => !withdraw.is_approved && !withdraw.is_rejected
      );
      setWithdrawals(pendingWithdrawals);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (withdraw, action) => {
    setSelectedWithdraw(withdraw);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      await adminAxios.post("/admin/redeem-action/", {
        withdraw_id: selectedWithdraw.id,
        action: actionType,
      });
      setShowConfirmModal(false);
      fetchWithdrawals(); // refresh list after action
      setMessage({
        type: actionType,
        text: `Withdrawal request ${actionType}d successfully!`,
      });
    } catch (error) {
      setMessage({
        type: "reject",
        text: `Error: ${error.response?.data?.error || "Something went wrong"}`,
      });
    }
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setSelectedWithdraw(null);
    setActionType("");
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const parsedDate = parseDateTime(withdrawal.created_at);
    const searchTermLower = searchTerm.toLowerCase();
    const userInfo = `${withdrawal.user?.username || ""} ${
      withdrawal.user?.mobile || ""
    }`.toLowerCase();
    const date = parsedDate
      ? parsedDate.toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-";
    const time = parsedDate
      ? parsedDate.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "-";
    return (
      userInfo.includes(searchTermLower) ||
      withdrawal.amount.toString().includes(searchTerm) ||
      date.includes(searchTerm) ||
      time.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="panel">
      <h2>Withdrawal Requests</h2>

      {/* Success/Error Message */}
      {message && (
        <div
          style={{
            marginBottom: 16,
            color: message.type === "approve" ? "green" : "red",
            background: message.type === "approve" ? "#e6ffe6" : "#ffe6e6",
            border: `1px solid ${
              message.type === "approve" ? "#b2ffb2" : "#ffb2b2"
            }`,
            padding: 10,
            borderRadius: 6,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {message.text}
          <button
            style={{
              marginLeft: 12,
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={() => setMessage(null)}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{withdrawals.length}</span>
          <span className="stat-label">Pending Requests</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            ₹
            {withdrawals
              .reduce((sum, with_) => sum + parseFloat(with_.amount), 0)
              .toFixed(2)}
          </span>
          <span className="stat-label">Total Amount</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username, mobile, or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-message">Loading withdrawal requests...</div>
      ) : (
        <div
          className="panel-content"
          style={{
            maxHeight: "60vh",
            overflow: "auto",
            borderRadius: "8px",
            boxShadow: "0 2px 8px #e0e0e0",
          }}
        >
          <table className="admin-table enhanced-table">
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#f8fafc",
                zIndex: 1,
              }}
            >
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Amount</th>
                <th>UPI ID</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>{withdrawal.id}</td>
                    <td className="user-details">
                      <div className="user-info">
                        <strong>{withdrawal.user?.username}</strong>
                        <span className="mobile">
                          {withdrawal.user?.mobile}
                        </span>
                      </div>
                    </td>
                    <td className="amount-cell">₹{withdrawal.amount}</td>
                    <td className="upi-cell">{withdrawal.upi_id || "-"}</td>
                    <td className="date-cell">
                      <div className="datetime">
                        <span className="date">
                          {(() => {
                            const parsedDate = parseDateTime(
                              withdrawal.created_at
                            );
                            return parsedDate
                              ? parsedDate.toLocaleDateString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              : "-";
                          })()}
                        </span>
                        <span className="time">
                          {(() => {
                            const parsedDate = parseDateTime(
                              withdrawal.created_at
                            );
                            return parsedDate
                              ? parsedDate.toLocaleTimeString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              : "-";
                          })()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn approve"
                          onClick={() =>
                            handleActionClick(withdrawal, "approve")
                          }
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() =>
                            handleActionClick(withdrawal, "reject")
                          }
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No pending withdrawal requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedWithdraw && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="withdrawal-details">
                <h4>Withdrawal Request Details:</h4>
                <div className="detail-row">
                  <span>Username:</span>
                  <strong>{selectedWithdraw.user?.username}</strong>
                </div>
                <div className="detail-row">
                  <span>Mobile:</span>
                  <strong>{selectedWithdraw.user?.mobile}</strong>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <strong>₹{selectedWithdraw.amount}</strong>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <strong>
                    {(() => {
                      const parsedDate = parseDateTime(
                        selectedWithdraw.created_at
                      );
                      return parsedDate
                        ? parsedDate.toLocaleDateString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-";
                    })()}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Time:</span>
                  <strong>
                    {(() => {
                      const parsedDate = parseDateTime(
                        selectedWithdraw.created_at
                      );
                      return parsedDate
                        ? parsedDate.toLocaleTimeString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : "-";
                    })()}
                  </strong>
                </div>
              </div>
              <div className="confirmation-message">
                Are you sure you want to <strong>{actionType}</strong> this
                withdrawal request?
                {actionType === "approve" && (
                  <div className="approval-note">
                    ₹{selectedWithdraw.amount} will be deducted from the user's
                    wallet.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`confirm-btn ${actionType}`}
                onClick={confirmAction}
              >
                {actionType === "approve" ? "✓ Approve" : "✗ Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequestPanel;
