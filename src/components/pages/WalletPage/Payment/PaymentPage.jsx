import React, { useState, useEffect, useRef } from "react";
import "./PaymentPage.css";
import infoIcon from "../../../../assets/paytm-icon.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, paymentMethod } = location.state || {};

  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null); // QR image state
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const timerRef = useRef();

  // 🔁 Fetch QR code on mount
  useEffect(() => {
    const fetchQRImage = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/get-photos/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.length > 0) {
          // Pick a random image from the list
          const randomIdx = Math.floor(Math.random() * response.data.length);
          setQrImage(response.data[randomIdx].image);
        }
      } catch (err) {
        console.error("Failed to fetch QR image:", err);
      }
    };

    fetchQRImage();
  }, []);

  // Timer countdown and redirect after 5 minutes
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          navigate("/addchips");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [navigate]);

  const handleConfirmPayment = async () => {
    if (!/^[0-9]{12}$/.test(utr)) {
      setError("⚠️ Please enter a valid 12-digit UTR number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/coin-requests/",
        {
          amount: amount,
          utr_number: utr,
          payment_method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/addchipssuccess", {
        state: {
          amount: amount,
          transactionId: response.data.request_id,
        },
      });
    } catch (error) {
      console.error("Deposit request failed:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Failed to submit deposit request. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="card-title">Complete Your Payment</h2>

        <div className="qr-scanner-container">
          <div className="qr-scanner">
            <div className="qr-placeholder">
              <div className="qr-animation">
                {qrImage ? (
                  <img
                    src={
                      qrImage.startsWith("http")
                        ? qrImage
                        : `http://localhost:8000${qrImage}`
                    }
                    alt="QR Code"
                    className="qr-image"
                  />
                ) : (
                  <span style={{ color: "#fff" }}>Loading QR...</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Timer at the bottom of the card, in red */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span
            style={{
              color: "#ff3333",
              fontWeight: 700,
              // fontSize: 20,
              letterSpacing: 1,
              // background: "#fff0f0",
              padding: "8px 24px",
              borderRadius: 8,
              display: "inline-block",
              boxShadow: "0 1px 6px #0002",
            }}
          >
            Time left:{" "}
            {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
              timer % 60
            ).padStart(2, "0")}`}
          </span>
        </div>

        <p className="scan-instruction">
          Scan this code using <strong>{paymentMethod}</strong> to pay ₹{amount}
        </p>

        <div className="payment-form">
          <div className="form-group">
            <label className="form-label">
              UTR Number
              <span className="info-tooltip">
                <span className="tooltip-text">
                  Unique Transaction Reference number provided by your bank
                </span>
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter 12-digit UTR"
              value={utr}
              onChange={(e) => {
                setUtr(e.target.value);
                setError("");
              }}
              pattern="[0-9]{12}"
              maxLength="12"
              required
            />
            {error && <p className="utr-error">{error}</p>}
          </div>

          <button
            className="submit-btn"
            type="button"
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? "Submitting..." : "CONFIRM PAYMENT"}
          </button>
        </div>

        <div className="find-utr-section">
          <h4>How to Find Your UTR Number:</h4>
          <ul>
            <li>Check your bank SMS for the transaction confirmation</li>
            <li>Look for a 12-digit number labeled "UTR" or "Ref No"</li>
            <li>In PhonePe: Transactions → Select payment → View details</li>
            <li>In Google Pay: Open receipt → Check "Transaction ID"</li>
            <li>In Paytm: Passbook → Select transaction → View UTR</li>
          </ul>
        </div>
      </div>

      <div className="payment-instructions">
        <div className="important-note">
          <strong>Note:</strong> Fake UTR numbers will result in account
          suspension.
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
