import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Boxes.css";
import {
  FaCrown,
  FaGem,
  FaCoins,
  FaTrophy,
  FaLock,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Parse "HH:MM" to Date object (today) in IST
function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  const now = getNowIST();
  // Create a date in IST for today
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
}

// Format "HH:MM" to 12hr string in IST
function formatTime(str) {
  const [h, m] = str.split(":").map(Number);
  const now = getNowIST();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    h,
    m,
    0,
    0
  );
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

// Check if now is between start and end (handles overnight)
function isBetween(now, start, end) {
  if (start < end) return now >= start && now < end;
  return now >= start || now < end;
}

// For all games: lock only after closeTime
function getGameLockStatus(game, now) {
  const open = parseTime(game.openTime);
  const close = parseTime(game.closeTime);
  // If open < close (same day): open between open and close
  if (open < close) {
    if (now >= open && now < close) {
      return {
        locked: false,
        lockMsg: `Open till ${formatTime(game.closeTime)}`,
      };
    } else {
      return {
        locked: true,
        lockMsg: `Locked. Open at ${formatTime(game.openTime)}`,
      };
    }
  } else {
    // Overnight: openTime > closeTime (e.g., open 10:00, close 02:30 next day)
    if (now >= open || now < close) {
      return {
        locked: false,
        lockMsg: `Open till ${formatTime(game.closeTime)}`,
      };
    } else {
      return {
        locked: true,
        lockMsg: `Locked. Open at ${formatTime(game.openTime)}`,
      };
    }
  }
}

const GAME_SCHEDULES = [
  {
    key: "faridabad",
    name: "Faridabad",
    icon: <FaCrown />,
    closeTime: "17:30",
    resultTime: "18:10",
    wining: "1/95",
    openTime: "10:00",
    color: "#50C878",
    btnColor: "#50C878",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#50C878",
    path: "/faridabad",
  },
  {
    key: "jaipur",
    name: "Jaipur King",
    icon: <FaCrown />,
    closeTime: "19:50",
    resultTime: "20:00",
    wining: "1/100",
    openTime: "10:00",
    color: "#FFD700",
    btnColor: "#FFD700",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#FFD700",
    path: "/jaipur",
  },
  {
    key: "ghaziabad",
    name: "Ghaziabad",
    icon: <FaCrown />,
    closeTime: "21:20",
    resultTime: "22:10",
    wining: "1/95",
    openTime: "10:00",
    color: "#4169E1",
    btnColor: "#4169E1",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#4169E1",
    path: "/ghaziabad",
  },
  {
    key: "diamond",
    name: "Diamond King",
    icon: <FaGem />,
    closeTime: "22:50",
    resultTime: "23:00",
    wining: "1/100",
    openTime: "10:00",
    color: "#E91E63",
    btnColor: "#E91E63",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#E91E63",
    path: "/diamond",
  },
  {
    key: "gali",
    name: "Gali",
    icon: <FaCrown />,
    closeTime: "23:20",
    resultTime: "12:00",
    wining: "1/95",
    openTime: "10:00",
    color: "#9370DB",
    btnColor: "#9370DB",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#9370DB",
    path: "/gali",
  },

  {
    key: "disawer",
    name: "Disawer",
    icon: <FaGem />,
    closeTime: "02:30",
    resultTime: "05:00",
    wining: "1/95",
    openTime: "10:00",
    color: "#FF6B6B",
    btnColor: "#FF6B6B",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#FF6B6B",
    path: "/disawer",
  },
];

// Get current IST time as a Date object
function getNowIST() {
  const now = new Date();
  const istOffset = 330; // 5:30 in minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset * 60000);
}

const Boxes = () => {
  const [now, setNow] = useState(getNowIST());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getNowIST());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="game-container">
      {/* Game Cards Grid */}
      <div className="game-cards-grid">
        {GAME_SCHEDULES.map((game, idx) => {
          const status = getGameLockStatus(game, now);
          return (
            <motion.div
              key={game.key}
              className={`game-card-new ${status.locked ? "locked" : ""}`}
              style={{
                "--card-color": game.color,
                "--card-bg": game.bgColor,
                "--card-border": game.borderColor,
                "--btn-color": game.btnColor,
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Header */}
              <div className="card-header-new">
                <motion.div
                  className="game-icon-new"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {game.icon}
                </motion.div>
                <h3 className="game-title-new">{game.name}</h3>
              </div>

              {/* Game Timings */}
              <div className="game-timings-new">
                <div className="timing-row-new">
                  <span className="timing-label-new">Result:</span>
                  <span className="timing-value-new">
                    {formatTime(game.resultTime)}
                  </span>
                </div>
                <div className="timing-row-new">
                  <span className="timing-label-new">Close:</span>
                  <span className="timing-value-new">
                    {formatTime(game.closeTime)}
                  </span>
                </div>
                <div className="timing-row-new live-row">
                  <span className="live-indicator">
                    <span className="live-dot"></span>
                    Wining:
                  </span>

                  <span className="live-time">{game.wining}</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="game-status-new">
                <div className="status-text">
                  {status.locked
                    ? `Open at ${formatTime(game.openTime)}`
                    : "Open for Join"}
                </div>

                {status.locked ? (
                  <motion.button
                    className="play-btn-new locked"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaLock /> Locked
                  </motion.button>
                ) : (
                  <motion.button
                    className="play-btn-new"
                    onClick={() =>
                      navigate("/numbers", { state: { game: game.name } })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join Now <FaArrowRight />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Boxes;
