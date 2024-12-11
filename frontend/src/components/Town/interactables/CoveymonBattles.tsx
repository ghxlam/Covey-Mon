/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Player } from '../../../types/CoveyTownSocket';
import { useToast } from '@chakra-ui/react';
   
interface Stat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };

interface Move {
  name: string;
  damage: number;
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  currHealth: number;
  health: number;
  attack: number;
  defense: number;
  moves: { name: string; power: number | null }[];
  maxHealth: number;
}

const getPokemon = async (): Promise<Pokemon[]> => {
  try {
    // Fetch all Kanto region Pokémon (151 total)
    const response = await fetch('https://pokeapi.co/api/v2/pokedex/kanto');
    const data = await response.json();
    const pokemonList = data.pokemon_entries;
    const allPokemon: Pokemon[] = [];

    // Function to fetch move details
    const getMovePower = async (moveName: string): Promise<number | null> => {
      try {
        const moveResponse = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        const moveData = await moveResponse.json();
        return moveData.power !== null ? moveData.power : null;
      } catch (error) {
        console.error('Error fetching move data:', error);
        return null;
      }
    };

    // Loop through each Pokémon in the Kanto region
    for (let i = 0; i < pokemonList.length; i++) {
      const pokemonName = pokemonList[i].pokemon_species.name;
      const pokemonDataResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemon = await pokemonDataResponse.json();

      const stats = pokemon.stats.reduce(
        (acc: { health: number; attack: number; defense: number }, stat: Stat) => {
          if (stat.stat.name === 'hp') {
            acc.health = stat.base_stat;
          } else if (stat.stat.name === 'attack') {
            acc.attack = stat.base_stat;
          } else if (stat.stat.name === 'defense') {
            acc.defense = stat.base_stat;
          }
          return acc;
        },
        { health: 0, attack: 0, defense: 0 },
      );

      const sprite = pokemon.sprites.front_default; // Default front facing image

      const moves = pokemon.moves.map((move: { move: { name: string } }) => move.move.name);

      const pickedMoves = [];
      for (let j = 0; j < 4; j++) {
        const moveName = moves[Math.floor(Math.random() * moves.length)];
        const movePower = await getMovePower(moveName);
        pickedMoves.push({ name: moveName, power: movePower });
      }

      allPokemon.push({
        id: i,
        name: pokemon.name,
        attack: stats.attack,
        defense: stats.defense,
        currHealth: Math.floor(Math.random() * stats.health + 1),
        health: stats.health,
        sprite: sprite,
        moves: pickedMoves,
      });
    }

    return allPokemon;
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);
    return [];
  }
};

// once a player picks a move, an turn function runs called turn
//turn takes 3 parameters (player pokemon, bot pokemon, and the move player chose) which picks either 1 or 2 and then goes from there for who goes first
// damage works by taking two parameters, the move and the attacking pokemon
// using the move's power and the pokemons stats, damage is assigned to the pokemon
// even if we dont have a bot, we can just have a button to do damage to the chosen pokemon (covers user story 3)

// disabling the linter here because it doesn't detect this as a function and when we follow
// camelCase, it doesn't allow us to call it or use the hooks inside the function.
// eslint-disable-next-line @typescript-eslint/naming-convention
const ParentComponent: React.FC = () => {
  const toast = useToast();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  let bot: Pokemon; // bot assigned pokemon
  const [availablePokemons] = useState<Pokemon[]>([]);
  getPokemon().then(allPokemon => {
    allPokemon.forEach(function (pokemon) {
      availablePokemons.push(pokemon);
    });
    bot = availablePokemons[Math.floor(Math.random() * availablePokemons.length + 1)]; // got get randomly assigned pokemon
  });

  /* Placeholder data FOR NOW. Replace this with API integration whenever we figure out whats wrong. */
  /*{
      id: 1,
      name: 'Pikachu',
      sprite: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      health: 100,
      attack: 50,
      defense: 70,
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
      sprite: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
      health: 150,
      attack: 50,
      defense: 70,
      moves: ['Flamethrower', 'Dragon Claw', 'Fly', 'Fire Spin'],
    },*/

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
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4A90E2' }}>IN PROGRESS</h1>
      <div>
        <h2>Players in the Game:</h2>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Available Pokémon:</h2>
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
                src={pokemon.sprite}
                alt={pokemon.name}
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <h3>{pokemon.name}</h3>
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
