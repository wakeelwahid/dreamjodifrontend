import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Boxes.css";
import userAxios from "../../utils/userAxios";
import { FaCrown, FaGem, FaLock, FaArrowRight } from "react-icons/fa";

const ICON_MAP = {
  faridabad: <FaCrown />,
  jaipur: <FaCrown />,
  ghaziabad: <FaCrown />,
  diamond: <FaGem />,
  gali: <FaCrown />,
  disawer: <FaCrown />,
};

// Format "HH:MM" to 12hr string in IST
function formatTime(str) {
  if (!str) return "-";
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

// Parse "HH:MM" to Date object (today) in IST
function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  const now = getNowIST();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
}

// For all games: lock only after closeTime
function getGameLockStatus(game, now) {
  if (!game.openTime || !game.closeTime) return { locked: true, lockMsg: "-" };
  const open = parseTime(game.openTime);
  const close = parseTime(game.closeTime);
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

// Get current IST time as a Date object
function getNowIST() {
  const now = new Date();
  const istOffset = 330; // 5:30 in minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset * 60000);
}

const Boxes = () => {
  const [now, setNow] = useState(getNowIST());
  const [gameSchedules, setGameSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getNowIST());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await userAxios.get("/game-schedules/");
        // Add icon property to each game
        const withIcons = (res.data.schedules || []).map((g) => ({
          ...g,
          icon: ICON_MAP[g.key] || <FaCrown />,
        }));
        setGameSchedules(withIcons);
      } catch (err) {
        setGameSchedules([]);
      }
    }
    fetchSchedules();
  }, []);

  return (
    <div className="game-container">
      {/* Game Cards Grid */}
      <div className="game-cards-grid">
        {gameSchedules.map((game, idx) => {
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
