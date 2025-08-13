import React, { useState, useEffect, useRef } from "react";
import "./PaymentPage.css";
import infoIcon from "../../../../assets/paytm-icon.png";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../../../api/axiosSetup";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, paymentMethod } = location.state || {};

  const [utr, setUtr] = useState("");
  const [upi, setUpi] = useState("");
  const [utrError, setUtrError] = useState("");
  const [upiError, setUpiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrImages, setQrImages] = useState([]); // All QR images for amount
  const [qrImage, setQrImage] = useState(null); // Selected QR image
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const timerRef = useRef();

  // 🔁 Fetch QR code on mount
  // Helper to pick a random image from array
  const pickRandomQR = (arr) => {
    if (!arr || arr.length === 0) return null;
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx].image;
  };

  // Fetch all QR images for the amount on mount
  useEffect(() => {
    const fetchQRImages = async () => {
      try {
        const response = await API.get(`/get-photos/?amount=${amount}`);
        if (response.data.length > 0) {
          setQrImages(response.data);
          setQrImage(pickRandomQR(response.data));
        }
      } catch (err) {}
    };
    fetchQRImages();
  }, [amount]);

  // On timer reset or page refresh, pick a new random QR
  useEffect(() => {
    if (timer === 300 && qrImages.length > 0) {
      setQrImage(pickRandomQR(qrImages));
    }
    // eslint-disable-next-line
  }, [timer]);

  // Timer countdown and redirect after 5 minutes
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // On timeout, pick a new random QR for next visit
          setQrImage(pickRandomQR(qrImages));
          navigate("/addchips");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [navigate, qrImages]);

  const handleConfirmPayment = async () => {
    let valid = true;
    if (!/^[0-9]{12}$/.test(utr)) {
      setUtrError("⚠️ Please enter a valid 12-digit UTR number.");
      valid = false;
    } else {
      setUtrError("");
    }
    if (!upi || !/^[\w.-]+@[\w.-]+$/.test(upi)) {
      setUpiError("⚠️ Please enter a valid UPI ID (e.g. example@upi)");
      valid = false;
    } else {
      setUpiError("");
    }
    if (!valid) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await API.post("/coin-requests/", {
        amount: amount,
        utr_number: utr,
        payment_method: paymentMethod,
        upi_id: upi,
      });
      navigate("/addchipssuccess", {
        state: {
          amount: amount,
          transactionId: response.data.request_id,
          upi_id: upi,
        },
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Failed to submit deposit request. Please try again.";
      setUtrError(errorMsg); // Show error under UTR field
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
            <input
              type="text"
              className="form-input"
              placeholder="Enter 12-digit UTR"
              value={utr}
              onChange={(e) => {
                setUtr(e.target.value);
                setUtrError("");
              }}
              pattern="[0-9]{12}"
              maxLength="12"
              required
            />
            {utrError && <p className="utr-error">{utrError}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Enter UPI ID"
              value={upi}
              onChange={(e) => {
                setUpi(e.target.value);
                setUpiError("");
              }}
              required
            />
            <p style={{ marginTop: "5px" }}>
              <span style={{ color: "red" }}>नोट:</span> जिस UPI से जमा करोगे,
              उसी UPI मे विड्रॉ (withdraw) आएगा।
            </p>
            {upiError && <p className="utr-error">{upiError}</p>}
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
