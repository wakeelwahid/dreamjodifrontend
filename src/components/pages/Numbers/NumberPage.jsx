import React, { useState, useEffect } from "react";
import "./NumberPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../../api/axiosSetup";

function NumberPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameName = location.state?.game || "unknown";

  const [selectedNumbers, setSelectedNumbers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentAmount, setCurrentAmount] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [errorMsg, setErrorMsg] = useState("");
  const [balanceError, setBalanceError] = useState("");

  const standardAmounts = [10, 50, 100, 300, 500, 1000];
  const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const andarNumbers = Array.from({ length: 10 }, (_, i) => i);
  const baharNumbers = Array.from({ length: 10 }, (_, i) => i);

  const MIN_ENTRY = 10;
  const MAX_ENTRY = 10000;

  const openAmountPopup = (number, section) => {
    setCurrentSelection({ number, section });
    const key = `${number}-${section}`;
    const existing = selectedNumbers[key];
    setCurrentAmount(existing?.amount || "");
    setErrorMsg("");
    setShowPopup(true);
  };

  const closeAmountPopup = () => {
    setShowPopup(false);
    setCurrentSelection(null);
    setCurrentAmount("");
    setErrorMsg("");
  };

  const confirmAmount = (amount) => {
    const amt = Number(amount);
    if (
      currentSelection &&
      amt >= MIN_ENTRY &&
      amt <= MAX_ENTRY &&
      Number.isInteger(amt)
    ) {
      const key = `${currentSelection.number}-${currentSelection.section}`;
      setSelectedNumbers((prev) => ({
        ...prev,
        [key]: {
          amount: amt,
          section: currentSelection.section,
          number: currentSelection.number,
        },
      }));
      setErrorMsg("");
      closeAmountPopup();
    } else {
      setErrorMsg(
        `Bet amount must be between ₹${MIN_ENTRY} and ₹${MAX_ENTRY} (whole number).`
      );
    }
  };

  const removeNumber = (key) => {
    const newSelected = { ...selectedNumbers };
    delete newSelected[key];
    setSelectedNumbers(newSelected);
  };

  const clearAll = () => {
    setSelectedNumbers({});
  };

  const placeBet = async () => {
    setBalanceError("");
    const totalNumbers = Object.keys(selectedNumbers).length;
    if (totalNumbers === 0) {
      setBalanceError("Please select at least one number!");
      return;
    }
    for (const key in selectedNumbers) {
      const amt = selectedNumbers[key].amount;
      if (amt < MIN_ENTRY || amt > MAX_ENTRY || !Number.isInteger(amt)) {
        setBalanceError(
          `Bet amount for number ${selectedNumbers[key].number} must be between ₹${MIN_ENTRY} and ₹${MAX_ENTRY} (whole number).`
        );
        return;
      }
    }
    try {
      for (const key in selectedNumbers) {
        const bet = selectedNumbers[key];
        const payload = {
          game_name: gameName,
          number: bet.number,
          bet_type: bet.section === "all" ? "number" : bet.section,
          amount: bet.amount,
        };
        await API.post("place-entry/", payload);
      }
      navigate("/ordersuccess", {
        state: {
          game: gameName,
          numbers: Object.values(selectedNumbers).map((n) => n.number),
          amount: totalAmount,
        },
      });
    } catch (error) {
      if (
        error.response?.data?.error &&
        (error.response.data.error.toLowerCase().includes("insufficient") ||
          error.response.data.error.toLowerCase().includes("balance"))
      ) {
        setBalanceError(error.response.data.error);
      } else {
        setBalanceError(
          "Bet failed: " + (error.response?.data?.error || "Server error")
        );
      }
    }
  };

  const totalAmount = Object.values(selectedNumbers).reduce(
    (sum, num) => sum + num.amount,
    0
  );

  const isSelected = (number, section) => {
    return !!selectedNumbers[`${number}-${section}`];
  };

  // Top selected numbers list
  const selectedList = Object.entries(selectedNumbers);

  return (
    <div className="num-container">
      {balanceError && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          {balanceError}
        </div>
      )}
      <div className="game-header">
        <h1>{gameName.toUpperCase()}</h1>
        <p className="game-subtitle">Select your numbers</p>
      </div>

      {/* Selected numbers bar - always visible but empty when no selections */}
      <div
        className={`selected-list-container ${
          selectedList.length > 0 ? "has-items" : ""
        }`}
      >
        <div className="selected-list-wrapper">
          <div className="selected-list">
            {selectedList.length > 0 ? (
              selectedList.map(([key, val]) => (
                <div className={`selected-item ${val.section}`} key={key}>
                  {val.section !== "all" && (
                    <span className="section-mark">
                      {val.section === "andar" ? "A" : "B"}
                    </span>
                  )}
                  <span className="number">{val.number}</span>
                  <span className="amount">₹{val.amount}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeNumber(key)}
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-message">No numbers selected</div>
            )}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="section-tabs">
        <button
          className={`tab-btn ${activeSection === "all" ? "active" : ""}`}
          onClick={() => setActiveSection("all")}
        >
          All Numbers
        </button>
        <button
          className={`tab-btn ${activeSection === "andar" ? "active" : ""}`}
          onClick={() => setActiveSection("andar")}
        >
          Andar
        </button>
        <button
          className={`tab-btn ${activeSection === "bahar" ? "active" : ""}`}
          onClick={() => setActiveSection("bahar")}
        >
          Bahar
        </button>
      </div>

      {/* Number grids */}
      <div className="number-content">
        {activeSection === "all" && (
          <div className="number-grid-container">
            <div className="number-grid">
              {allNumbers.map((number) => (
                <button
                  key={number}
                  className={`number-cell ${
                    isSelected(number, "all") ? "selected" : ""
                  }`}
                  onClick={() => openAmountPopup(number, "all")}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === "andar" && (
          <div className="section-grid">
            <div className="number-grid-container">
              <div className="number-grid andar-grid">
                {andarNumbers.map((number) => (
                  <button
                    key={`andar-${number}`}
                    className={`number-cell andar ${
                      isSelected(number, "andar") ? "selected" : ""
                    }`}
                    onClick={() => openAmountPopup(number, "andar")}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "bahar" && (
          <div className="section-grid">
            <div className="number-grid-container">
              <div className="number-grid bahar-grid">
                {baharNumbers.map((number) => (
                  <button
                    key={`bahar-${number}`}
                    className={`number-cell bahar ${
                      isSelected(number, "bahar") ? "selected" : ""
                    }`}
                    onClick={() => openAmountPopup(number, "bahar")}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar - only shows when there are selections */}
      {selectedList.length > 0 && (
        <div className="action-bar">
          <div className="total-display">
            <span className="total-label">Total Bet:</span>
            <span className="total-amount">₹{totalAmount}</span>
          </div>
          <div className="num-action-buttons">
            <button
              className="action-btn clear1-btn"
              id="clear1-btn"
              onClick={clearAll}
            >
              Clear All
            </button>
            <button className="action-btn confirm-btn" onClick={placeBet}>
              Confirm Entry
            </button>
          </div>
        </div>
      )}

      {/* Amount selection popup */}
      {showPopup && (
        <div className="amount-popup-container">
          <div className="amount-popup">
            <h3>
              Entry on <span>{currentSelection?.number}</span>
            </h3>
            <div className="amount-options">
              {standardAmounts.map((amt) => (
                <button
                  key={amt}
                  className={`amount-option ${
                    Number(currentAmount) === amt ? "active" : ""
                  }`}
                  onClick={() => setCurrentAmount(amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder={`Custom amount (${MIN_ENTRY}-${MAX_ENTRY})`}
                min={MIN_ENTRY}
                max={MAX_ENTRY}
                step={1}
              />
            </div>
            {errorMsg && <div className="error-message">{errorMsg}</div>}
            <div className="popup-actions">
              <button className="popup-btn cancel" onClick={closeAmountPopup}>
                Cancel
              </button>
              <button
                className="popup-btn confirm"
                onClick={() => confirmAmount(currentAmount)}
              >
                Confirm
              </button>
            </div>
          </div>
          <div className="popup-overlay" onClick={closeAmountPopup}></div>
        </div>
      )}
    </div>
  );
}

export default NumberPage;
