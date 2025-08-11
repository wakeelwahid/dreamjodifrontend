
import React from 'react';
import './GameRules.css';

const GameRules = () => {
  return (
    <div className="game-rules-container">
     

      <div className="rules-content">
        <div className="rules-section">
          <h2>Basic Rules</h2>
          <ul>
            <li>All round start at their designated time</li>
            <li>Numbers range from 00-99</li>
            <li>Results are declared as per schedule</li>
            <li>Minimum entry amount: ₹10</li>
            <li>Maximum entry amount: ₹10,000</li>
          </ul>
        </div>

        <div className="rules-section">
          <h2>Entries Types</h2>
          <div className="bet-type">
            <h3>Single Digit (0-9)</h3>
            <p>entry on any single digit. Win 9x your entry amount.</p>
          </div>
          <div className="bet-type">
            <h3>Jodi (1-100)</h3>
            <p>entry on exact 2-digit number. Win 90x your entry amount.</p>
          </div>
        </div>

        <div className="rules-section">
          <h2>Important Notes</h2>
          <ul>
            <li>All entry must be placed before round closing time</li>
            <li>Once placed, entry cannot be cancelled</li>
            <li>Results are final and cannot be disputed</li>
            <li>Maintain adequate balance before placing entry</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameRules;
