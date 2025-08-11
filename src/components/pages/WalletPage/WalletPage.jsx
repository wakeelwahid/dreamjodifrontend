import "./WalletPage.css";
import { Link } from "react-router-dom";
import userAxios from "../../../api/axiosSetup";
import React, { useEffect, useState } from "react";

const WalletPage = () => {
  const [wallet, setWallet] = useState({
    balance: "0.00",
    bonus: "0.00",
    winnings: "0.00",
    withdrawable_balance: "0.00",
  });

  const [referralBonus, setReferralBonus] = useState({
    direct_bonus: "0.00",
    commission_earned: "0.00",
  });

  const getTotalBalance = () => {
    const deposit = parseFloat(wallet.balance) || 0;
    const bonus = parseFloat(wallet.bonus) || 0;
    const winnings = parseFloat(wallet.winnings) || 0;
    return (deposit + bonus + winnings).toFixed(2);
  };

  const getTotalBonusAmount = () => {
    const directBonus = parseFloat(referralBonus.direct_bonus) || 0;
    const commission = parseFloat(referralBonus.commission_earned) || 0;
    return (directBonus + commission).toFixed(2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [walletRes, referralRes] = await Promise.all([
          userAxios.get("http://127.0.0.1:8000/api/balance/", { headers }),
          userAxios.get("http://127.0.0.1:8000/api/user/my-referrals/", {
            headers,
          }),
        ]);

        setWallet(walletRes.data);
        setReferralBonus({
          direct_bonus: referralRes.data.direct_bonus || "0.00",
          commission_earned: referralRes.data.commission_earned || "0.00",
        });

        // ✅ Dispatch event to update Header
        window.dispatchEvent(new Event("walletUpdateEvent"));
      } catch (error) {
        console.error("Error fetching wallet/referral data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="kyc-btn-container">
        <Link to="/verification" className="kyc-button">
          <i className="fas fa-id-card"></i> COMPLETE KYC
        </Link>
      </div>

      <div className="wallet-card">
        <div className="balance-section">
          <div className="balance-label">TOTAL COINS</div>
          <div className="total-balance">₹{getTotalBalance()}</div>
        </div>

        <div className="amount-cards">
          <div className="amount-card deposit-amount">
            <div className="amount-label">REDEEM COINS</div>
            <div className="amount-value">₹{wallet.winnings}</div>
            <div className="amount-subtext">Available for Redeem</div>
          </div>

          <div className="amount-card winnings-amount">
            <div className="amount-label">REWARD POINTS</div>
            <div className="amount-value">₹{getTotalBonusAmount()}</div>
          </div>
        </div>

        <div className="wall-action-buttons">
          <Link to="/dnotice" className="action-btn deposit-btn">
            <i className="fas fa-rupee-sign"></i> ADD COINS
          </Link>

          <Link to="/wconfirm" className="action-btn withdraw-btn">
            <i className="fas fa-wallet"></i> RADEEM COINS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
