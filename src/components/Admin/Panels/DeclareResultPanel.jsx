import React, { useState } from "react";
import adminAxios from "../../utils/adminAxios";

const DeclareResultPanel = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  const games = [
    { name: "disawer", label: "DISAWER" },
    { name: "gali", label: "GALI" },
    { name: "faridabad", label: "FARIDABAD" },
    { name: "ghaziabad", label: "GHAZIABAD" },
    { name: "jaipur king", label: "JAIPUR KING" },
    { name: "diamond king", label: "DIAMOND KING" },
  ];

  const declareResult = async () => {
    try {
      await adminAxios.post("/admin/declare-result/", {
        game_name: selectedGame.trim().toLowerCase(),
        winning_number: number,
      });
      setMessage("Result declared successfully");
      setNumber("");
      setSelectedGame("");
    } catch (error) {
      setMessage("Failed to declare result");
      console.error(error);
    }
  };

  // --- Undo Result Function ---
  const undoResult = async () => {
    try {
      const response = await adminAxios.post("/admin/undo-result/", {
        game_name: selectedGame.trim().toLowerCase(),
      });
      setMessage(response.data.message || "Undo successful");
    } catch (error) {
      setMessage("Failed to undo result");
      console.error(error);
    }
  };

  return (
    <div className="admin-declare">
      <h2>Declare Result</h2>
      <select
        value={selectedGame}
        onChange={(e) => setSelectedGame(e.target.value)}
        className="game-select dark"
      >
        <option value="">Select a game</option>
        {games.map((game) => (
          <option key={game.name} value={game.name}>
            {game.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Enter number"
        className="number-input dark"
      />
      <button
        onClick={declareResult}
        className="btn dark"
        style={{ color: "#fff", background: "#5cb805ff", marginTop: 8 }}
        disabled={!selectedGame || !number}
      >
        Declare
      </button>
      <button
        onClick={undoResult}
        className="btn dark"
        disabled={!selectedGame}
        style={{
          marginLeft: 8,
          color: "#fff",
          background: "#e53935",
          marginTop: 8,
        }}
      >
        Undo Result
      </button>
      {message && <p className="message dark">{message}</p>}
    </div>
  );
};

export default DeclareResultPanel;
