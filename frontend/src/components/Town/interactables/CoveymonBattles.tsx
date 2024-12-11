import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

interface Move {
  name: string;
  damage: number;
}

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  health: number;
  maxHealth: number;
  moves: Move[];
}

// disabling the linter here because it doesn't detect this as a function and when we follow
// camelCase, it doesn't allow us to call it or use the hooks inside the function.
// eslint-disable-next-line @typescript-eslint/naming-convention
const ParentComponent: React.FC = () => {
  const toast = useToast();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [availablePokemons] = useState<Pokemon[]>([
    /* Placeholder data FOR NOW. Replace this with API integration whenever we figure out whats wrong. */
    {
      id: 1,
      name: 'Pikachu',
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      health: 100,
      maxHealth: 100,
      moves: [
        { name: 'Thunder Shock', damage: 20 },
        { name: 'Quick Attack', damage: 15 },
        { name: 'Iron Tail', damage: 25 },
        { name: 'Electro Ball', damage: 30 },
      ],
    },
    {
      id: 2,
      name: 'Charizard',
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
      health: 150,
      maxHealth: 150,
      moves: [
        { name: 'Flamethrower', damage: 30 },
        { name: 'Dragon Claw', damage: 25 },
        { name: 'Fly', damage: 20 },
        { name: 'Fire Spin', damage: 35 },
      ],
    },
  ]);

  const [computerPokemon, setComputerPokemon] = useState<Pokemon | null>(null);
  const [playerHealth, setPlayerHealth] = useState<number>(0);
  const [computerHealth, setComputerHealth] = useState<number>(0);
  const [isBattleStarted, setIsBattleStarted] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleStartBattle = () => {
    if (selectedPokemon) {
      const randomPokemon = availablePokemons[Math.floor(Math.random() * availablePokemons.length)];
      setComputerPokemon(randomPokemon);
      setPlayerHealth(selectedPokemon.maxHealth);
      setComputerHealth(randomPokemon.maxHealth);
      setIsBattleStarted(true);
      setBattleLog([]);
    }
  };

  useEffect(() => {
    if (playerHealth <= 0 || computerHealth <= 0) {
      setIsBattleStarted(false);
      toast({
        title: playerHealth <= 0 ? 'You lost!' : 'You won!',
        description:
          playerHealth <= 0
            ? `${computerPokemon?.name} defeated ${selectedPokemon?.name}.`
            : `${selectedPokemon?.name} defeated ${computerPokemon?.name}!`,
        status: playerHealth <= 0 ? 'error' : 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [playerHealth, computerHealth, toast, selectedPokemon, computerPokemon]);

  const handlePlayerMove = (move: Move) => {
    if (!computerPokemon || !selectedPokemon || playerHealth <= 0 || computerHealth <= 0) return;

    // Player's attack
    const newComputerHealth = Math.max(computerHealth - move.damage, 0);
    setComputerHealth(newComputerHealth);
    setBattleLog(prev => [
      ...prev,
      `${selectedPokemon.name} used ${move.name}! It dealt ${move.damage} damage.`,
    ]);

    if (newComputerHealth > 0) {
      // Computer's response
      const computerMove =
        computerPokemon.moves[Math.floor(Math.random() * computerPokemon.moves.length)];
      setTimeout(() => {
        const newPlayerHealth = Math.max(playerHealth - computerMove.damage, 0);
        setPlayerHealth(newPlayerHealth);
        setBattleLog(prev => [
          ...prev,
          `${computerPokemon.name} used ${computerMove.name}! It dealt ${computerMove.damage} damage.`,
        ]);
      }, 1000);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4A90E2' }}>Battle Arena</h1>

      {!isBattleStarted && (
        <div>
          <h2>Select Your Pokémon:</h2>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {availablePokemons.map(pokemon => (
              <div
                key={pokemon.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '1rem',
                  width: '200px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedPokemon?.id === pokemon.id ? '#d0f0c0' : 'white',
                }}
                onClick={() => handleSelectPokemon(pokemon)}>
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{pokemon.name}</h3>
              </div>
            ))}
          </div>
          {selectedPokemon && (
            <button
              onClick={handleStartBattle}
              style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', cursor: 'pointer' }}>
              Start Battle
            </button>
          )}
        </div>
      )}

      {isBattleStarted && (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
          <div>
            <h3>Your Pokémon: {selectedPokemon?.name}</h3>
            <img
              src={selectedPokemon?.imageUrl}
              alt={selectedPokemon?.name}
              style={{ width: '150px', borderRadius: '10px' }}
            />
            <p>
              Health: {playerHealth} / {selectedPokemon?.maxHealth}
            </p>
            <h4>Choose a move:</h4>
            <div>
              {selectedPokemon?.moves.map(move => (
                <button
                  key={move.name}
                  onClick={() => handlePlayerMove(move)}
                  style={{
                    margin: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    backgroundColor: '#4caf50',
                    color: 'white',
                  }}>
                  {move.name} (Damage: {move.damage})
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Opponent Pokémon: {computerPokemon?.name}</h3>
            <img
              src={computerPokemon?.imageUrl}
              alt={computerPokemon?.name}
              style={{ width: '150px', borderRadius: '10px' }}
            />
            <p>
              Health: {computerHealth} / {computerPokemon?.maxHealth}
            </p>
          </div>
        </div>
      )}

      {battleLog.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '10px',
            maxWidth: '600px',
            margin: 'auto',
          }}>
          <h3>Battle History</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {battleLog.map((log, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
