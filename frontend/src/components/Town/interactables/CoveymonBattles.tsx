// Adding this disable because using <Image /> from next.js crashes and causes runtime errors randomly while <img /> doesn't.
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Pokemon, Move } from '../../../types/CoveyTownSocket';
import getPokemon from './api/PokeApi';

/**
 * This is the main modal where most of the magic happens for Coveymon. This is where you will be able to
 * select a PokeMon, check its stats, and battle another PokeMon and test your might!
 *
 * PS: Disabling the linter here because it doesn't detect this as a function and when we follow
 * camelCase, it doesn't allow us to call it or use the hooks inside the function. We can showcase this irl if you'd like,
 * same with the <Image /> linter disable.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const ParentComponent: React.FC = () => {
  const toast = useToast();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
  const [computerPokemon, setComputerPokemon] = useState<Pokemon | null>(null);
  const [playerHealth, setPlayerHealth] = useState<number>(0);
  const [computerHealth, setComputerHealth] = useState<number>(0);
  const [isBattleStarted, setIsBattleStarted] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon | null>(null);

  // Fetches the Pokemon Using the API Call while component sets up.
  useEffect(() => {
    const fetchPokemon = async () => {
      const allPokemon = await getPokemon();
      setAvailablePokemons(allPokemon);
    };
    fetchPokemon();
  }, []);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  /**
   * Called when the start game button in the Coveymon Modal is clicked.
   */
  const handleStartBattle = () => {
    if (selectedPokemon && availablePokemons.length > 0) {
      const randomPokemon = availablePokemons[Math.floor(Math.random() * availablePokemons.length)];
      setComputerPokemon(randomPokemon);
      setPlayerHealth(selectedPokemon.maxHealth);
      setComputerHealth(randomPokemon.maxHealth);
      setIsBattleStarted(true);
      setBattleLog([]);
    }
  };

  useEffect(() => {
    if (isBattleStarted && (playerHealth <= 0 || computerHealth <= 0)) {
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
  }, [playerHealth, computerHealth, isBattleStarted, toast, selectedPokemon, computerPokemon]);

  /**
   * Handles the player's move during a Pokemon battle.
   *
   * This function executes the player's move against the opponent Pokemon. It calculates the damage dealt
   * to the opponent, updates the opponent's health, and logs the action. If the opponent Pokemon survives
   * the attack, it responds with its own move, which damages the player's Pokemon and updates their health.
   *
   * @param move The move selected by the player on the Modal. Contains the move's name and power.
   */
  const handlePlayerMove = (move: Move) => {
    if (!computerPokemon || !selectedPokemon || playerHealth <= 0 || computerHealth <= 0) return;
    // Player's attack
    const damage = move.power || 0;
    const newComputerHealth = Math.max(computerHealth - damage, 0);
    setComputerHealth(newComputerHealth);
    setBattleLog(prev => [
      ...prev,
      `${selectedPokemon.name} used ${move.name}! It dealt ${damage} damage.`,
    ]);
    // Computer's Response
    if (newComputerHealth > 0) {
      const computerMove =
        computerPokemon.moves[Math.floor(Math.random() * computerPokemon.moves.length)];
      setTimeout(() => {
        const computerDamage = computerMove.power || 0;
        const newPlayerHealth = Math.max(playerHealth - computerDamage, 0);
        setPlayerHealth(newPlayerHealth);
        setBattleLog(prev => [
          ...prev,
          `${computerPokemon.name} used ${computerMove.name}! It dealt ${computerDamage} damage.`,
        ]);
      }, 1000);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4A90E2' }}>COVEYMON</h1>
      {!isBattleStarted && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Available Pokemon:</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '1rem',
              justifyContent: 'center',
              maxHeight: '400px', // Limit height for scrollable area
              overflowY: 'auto', // Add scroll behavior
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
            }}>
            {availablePokemons.map(pokemon => (
              <div
                key={pokemon.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedPokemon?.id === pokemon.id ? '#d0f0c0' : 'white',
                  position: 'relative', // For positioning the stats popup
                  transition: 'transform 0.2s',
                }}
                onClick={() => handleSelectPokemon(pokemon)}
                onMouseEnter={() => setHoveredPokemon(pokemon)}
                onMouseLeave={() => setHoveredPokemon(null)}>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{pokemon.name}</h3>

                {/* Display Stats on Hover */}
                {hoveredPokemon?.id === pokemon.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '110%',
                      backgroundColor: 'white',
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      zIndex: 1000,
                    }}>
                    <p>
                      <strong>HP:</strong> {pokemon.health}
                    </p>
                    <p>
                      <strong>Attack:</strong> {pokemon.attack}
                    </p>
                    <p>
                      <strong>Defense:</strong> {pokemon.defense}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedPokemon && (
            <button
              onClick={handleStartBattle}
              style={{
                marginTop: '1rem',
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'white',
                background: 'linear-gradient(45deg, #4A90E2, #0078d7)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0px 6px 10px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
              Start Battle
            </button>
          )}
        </div>
      )}

      {isBattleStarted && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2rem',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'green' }}>Your Pokemon: {selectedPokemon?.name}</h3>
              <img
                src={selectedPokemon?.sprite}
                alt={selectedPokemon?.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
              <p>
                Health: {playerHealth} / {selectedPokemon?.maxHealth}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'red' }}>Opponent Pokemon: {computerPokemon?.name}</h3>
              <img
                src={computerPokemon?.sprite}
                alt={computerPokemon?.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
              <p>
                Health: {computerHealth} / {computerPokemon?.maxHealth}
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '2rem',
              width: '80%',
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '10px',
              textAlign: 'center',
            }}>
            <h4>Choose a Move</h4>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedPokemon?.moves.map(move => (
                <button
                  key={move.name}
                  onClick={() => handlePlayerMove(move)}
                  style={{
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#45a049')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4caf50')}>
                  {move.name} (Damage: {move.power})
                </button>
              ))}
            </div>
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
