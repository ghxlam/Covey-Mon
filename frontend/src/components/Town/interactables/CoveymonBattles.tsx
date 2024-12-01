// CoveymonBattles.tsx
import React from 'react';
import PlayerController from '../../../classes/PlayerController';

interface CoveymonBattlesProps {
  players: PlayerController[]; // Expecting the list of players
}

const CoveymonBattles: React.FC<CoveymonBattlesProps> = ({ players }) => {
  return (
    <div>
      <h2>Coveymon Battle</h2>
      <p>Players:</p>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.userName}</li>
        ))}
      </ul>
      {/* Add more battle logic here */}
    </div>
  );
};

export default CoveymonBattles;
