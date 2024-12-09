/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  health: number;
  maxHealth: number;
  moves: string[];
}

// disabling the linter here because it doesn't detect this as a function and when we follow
// camelCase, it doesn't allow us to call it or use the hooks inside the function.
// eslint-disable-next-line @typescript-eslint/naming-convention
const ParentComponent: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [availablePokemons] = useState<Pokemon[]>([
    /* Placeholder data FOR NOW. Replace this with API integration whenever we figure out whats wrong. */
    {
      id: 1,
      name: 'Pikachu',
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      health: 80,
      maxHealth: 100,
      moves: ['Thunder Shock', 'Quick Attack', 'Iron Tail', 'Electro Ball'],
    },
    {
      id: 2,
      name: 'Charizard',
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
      health: 120,
      maxHealth: 150,
      moves: ['Flamethrower', 'Dragon Claw', 'Fly', 'Fire Spin'],
    },
  ]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
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
                src={pokemon.imageUrl}
                alt={pokemon.name}
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <h3>{pokemon.name}</h3>
              <div
                style={{
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  height: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                <div
                  style={{
                    width: `${(pokemon.health / pokemon.maxHealth) * 100}%`,
                    backgroundColor: '#4caf50',
                    height: '100%',
                  }}></div>
              </div>
              <p>
                {pokemon.health} / {pokemon.maxHealth} HP
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedPokemon && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Selected Pokémon: {selectedPokemon.name}</h2>
          <img
            src={selectedPokemon.imageUrl}
            alt={selectedPokemon.name}
            style={{ width: '150px', borderRadius: '10px' }}
          />
          <h3>Moves:</h3>
          <ul>
            {selectedPokemon.moves.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
