import React from 'react';
import { Player } from '../../../types/CoveyTownSocket';

interface ParentComponentProps {
  players: Player[];
}

const ParentComponent: React.FC<ParentComponentProps> = ({ players }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4A90E2' }}>IN PROGRESS</h1>
      <div>
        <h2>Players in the Game:</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.userName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParentComponent;
