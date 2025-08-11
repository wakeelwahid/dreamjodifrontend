import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameAnimations from "./components/GameAnimations";
import Header from "./components/header/Header";
import Footer from "./components/Footer/Footer";
import TopSection from "./components/top-section/Top_Section";
import Boxes from "./components/Boxes/Boxes";
import MyProfile from "./components/pages/MyProfile/MyProfile";
import WalletPage from "./components/pages/WalletPage/WalletPage";
import Refers from "./components/pages/Refers/Refers";
import SupportPage from "./components/pages/SupportPage/SupportPage";
import PrivacyPolicy from "./components/pages/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "./components/pages/RefundPolicy/RefundPolicy";
import TransactionsPage from "./components/pages/Transactions/Transactions";
import GameHistory from "./components/pages/GameHistory/GameHistory";
import TermsConditions from "./components/pages/TermsConditions/TermsConditions";
import GameRules from "./components/pages/GameRules/GameRules";
import AddChips from "./components/pages/WalletPage/Add-withdraw/AddChips";
import WithdrawChips from "./components/pages/WalletPage/Add-withdraw/WithdrawChips";
import PaymentPage from "./components/pages/WalletPage/Payment/PaymentPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import NumberPage from "./components/pages/Numbers/NumberPage";
import BetSuccessPage from "./components/pages/BetSuccess/BetSuccessPage";
import MyBet from "./components/pages/MyBet/MyBet";
import Verification from "./components/pages/Verification/KYCVerification";
import AddChipsSuccess from "./components/pages/AddChipsSuccess/AddChipsSuccess";
import WithdrawalChipsSuccess from "./components/pages/WithdrawalChipsSuccess/WithdrawalChipsSuccess";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import ForgotPassword from "./components/pages/Auth/ForgotPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import AgeVerification from "./components/AgeVerification/AgeVerification";
import AuthGuard from "./components/AuthGuard/AuthGuard";
import ViewResult from "./components/view-result/ViewResult";
import DepositNotice from "./components/pages/DepositNotice/DepositNotice";
import WithdrawNotice from "./components/pages/WithdrawalConfirm/WithdrawalConfirm";

import API from "./utils/userAxios";

const BlockedPopup = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.95)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      flexDirection: "column",
    }}
  >
    <h2 style={{ marginBottom: 16 }}>Aapko block kr diya gya hai</h2>
    <p style={{ marginBottom: 24 }}>
      Aapka account block hai. Contact kare support team se.
    </p>
    <a
      href="mailto:support@example.com"
      style={{
        background: "#fff",
        color: "#222",
        padding: "10px 24px",
        borderRadius: 6,
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      Contact Us
    </a>
  </div>
);

function App() {
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem("ageVerified") === "true";
  });
  const [blocked, setBlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  // Add to Home Screen prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showA2HS, setShowA2HS] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecked(true);
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await API.get("profile/", { headers });
        if (res.data.status === "blocked") {
          setBlocked(true);
          localStorage.removeItem("token");
        }
      } catch (err) {
        // Agar backend se 403/401 aaye toh bhi block dikhao
        if (err.response && err.response.status === 403) setBlocked(true);
      }
      setChecked(true);
    };
    checkStatus();

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowA2HS(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleA2HS = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setShowA2HS(false);
      });
    }
  };

  if (!checked) return null; // Jab tak check nahi hua, kuch bhi mat dikhao

  if (blocked) return <BlockedPopup />;

  const handleAgeConfirm = () => {
    setAgeVerified(true);
    localStorage.setItem("ageVerified", "true");
  };

  if (!ageVerified) {
    return <AgeVerification onConfirm={handleAgeConfirm} />;
  }

  return (
    <>
      {showA2HS && (
        <button
          onClick={handleA2HS}
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 9999,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: 18,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          Download App
        </button>
      )}
      <Router>
        <Routes>
          <Route path="/aarizmaan" element={<AdminLogin />} />
          <Route path="/aarizmaan/dashboard/*" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <GameAnimations />
                <Header />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <TopSection />
                        <Boxes />
                      </>
                    }
                  />
                  <Route path="/boxes" element={<Boxes />} />
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<MyProfile />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/refer" element={<Refers />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/refund" element={<RefundPolicy />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/history" element={<GameHistory />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/addchips" element={<AddChips />} />
                  <Route path="/withdrawchips" element={<WithdrawChips />} />
                  <Route path="/dnotice" element={<DepositNotice />} />
                  <Route path="/purchasechips" element={<PaymentPage />} />
                  <Route path="/numbers" element={<NumberPage />} />
                  <Route path="/ordersuccess" element={<BetSuccessPage />} />
                  <Route path="/mychips" element={<MyBet />} />
                  <Route path="/join" element={<Boxes />} />
                  <Route path="/verification" element={<Verification />} />
                  <Route
                    path="/addchipssuccess"
                    element={<AddChipsSuccess />}
                  />
                  <Route
                    path="/withdrawalchipssuccess"
                    element={<WithdrawalChipsSuccess />}
                  />
                  <Route path="/wconfirm" element={<WithdrawNotice />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/game-rules" element={<GameRules />} />
                  <Route path="/view-result" element={<ViewResult />} />
                </Routes>
                <Footer />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
