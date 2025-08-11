import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import "./Boxes.css";


// Parse "HH:MM" to Date object (today)
function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// Format "HH:MM" to 12hr string
function formatTime(str) {
  const [h, m] = str.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Check if now is between start and end (handles overnight)
function isBetween(now, start, end) {
  if (start < end) return now >= start && now < end;
  return now >= start || now < end;
}

// Diamond King: single session logic (like other games)
// Locked from closeTime to resultTime
function getDiamondKingStatus(now, resultTime, closeTime) {
  const open = parseTime(resultTime);
  const close = parseTime(closeTime);
  if (isBetween(now, close, open)) {
    return {
      locked: true,
      nextOpen: formatTime(resultTime),
      lockMsg: `Locked. Opens at ${formatTime(resultTime)}`,
    };
  }
  return { locked: false, lockMsg: `Open till ${formatTime(closeTime)}` };
}

// For all games: locked from closeTime to resultTime
function getGameLockStatus(game, now) {
  if (game.key === "diamond") {
    // Diamond King: single session, open 11:00, close 12:00
    return getDiamondKingStatus(now, game.resultTime, game.closeTime);
  }
  const close = parseTime(game.closeTime);
  const open = parseTime(game.resultTime);
  if (isBetween(now, close, open)) {
    return {
      locked: true,
      nextOpen: formatTime(game.resultTime),
      lockMsg: `Locked. Opens at ${formatTime(game.resultTime)}`,
    };
  }
  return { locked: false, lockMsg: `Open till ${formatTime(game.closeTime)}` };
}



const GAME_SCHEDULES = [
  {
    key: "faridabad",
    name: "Faridabad",
    icon: <FaCrown />,
    closeTime: "17:50",
    resultTime: "18:10",
    wining: "1/90",
    openTime: "22:30",
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
    closeTime: "18:00",
    resultTime: "18:20",
    wining: "1/100",
    openTime: "17:30",
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
    closeTime: "21:50",
    resultTime: "22:10",
    wining: "1/90",
    openTime: "23:30",
    color: "#4169E1",
    btnColor: "#4169E1",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#4169E1",
    path: "/ghaziabad",
  },
  {
    key: "gali",
    name: "Gali",
    icon: <FaCrown />,
    closeTime: "23:40",
    resultTime: "12:00",
    wining: "1/90",
    openTime: "1:30",
    color: "#9370DB",
    btnColor: "#9370DB",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#9370DB",
    path: "/gali",
  },
  {
    key: "diamond",
    name: "Diamond King",
    icon: <FaGem />,
    closeTime: "23:50",
    resultTime: "24:10",
    wining: "1/100",
    openTime: "1:30",
    color: "#E91E63",
    btnColor: "#E91E63",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#E91E63",
    path: "/diamond",
  },
  {
    key: "disawer",
    name: "Disawer",
    icon: <FaGem />,
    closeTime: "02:30",
    resultTime: "05:00",
    wining: "1/90",
    openTime: "7:00",
    color: "#FF6B6B",
    btnColor: "#FF6B6B",
    bgColor: "rgba(25, 25, 25, 0.9)",
    borderColor: "#FF6B6B",
    path: "/disawer",
  },
  
];

const Boxes = () => {
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
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
                 
                   <span className="live-time">
                    {game.wining}
                  </span>
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
