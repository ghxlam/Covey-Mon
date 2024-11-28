import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import PlayerController from '../../../classes/PlayerController'; // Assuming PlayerController is correctly imported

interface CoveymonBattlesProps {
  coveymonAreaController: CoveymonAreaController; // Pass the CoveymonAreaController as a prop
}

export default function CoveymonBattles({
  coveymonAreaController,
}: CoveymonBattlesProps): JSX.Element {
  const [players, setPlayers] = useState<PlayerController[]>([]);

  // Listen for player changes in the area
  useEffect(() => {
    const handleOccupantsChange = (newOccupants: PlayerController[]) => {
      setPlayers(newOccupants); // Update the player list when occupants change
    };

    coveymonAreaController.addListener('occupantsChange', handleOccupantsChange);

    // Cleanup listener when the component unmounts
    return () => {
      coveymonAreaController.removeListener('occupantsChange', handleOccupantsChange);
    };
  }, [coveymonAreaController]);

  const handleJoinGame = async () => {
    try {
      await coveymonAreaController.joinGame(); // Attempt to join the game
      alert('Joined the game!');
    } catch (error) {
      alert('Failed to join the game');
    }
  };

  const handleLeaveGame = async () => {
    try {
      await coveymonAreaController.leaveGame(); // Attempt to leave the game
      alert('Left the game!');
    } catch (error) {
      alert('Failed to leave the game');
    }
  };

  return (
    <div>
      <h1>Players in Battle</h1>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.id}</li> // Display the player names
        ))}
      </ul>

      <Button onClick={handleJoinGame} colorScheme='blue' disabled={players.length >= 2}>
        Join Game
      </Button>
      <Button onClick={handleLeaveGame} colorScheme='red' disabled={players.length === 0}>
        Leave Game
      </Button>
    </div>
  );
}
