/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
interface Stat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  currHealth: number;
  health: number;
  attack: number;
  defense: number;
  moves: string[];
}

const getPokemon = async (): Promise<Pokemon[]> => {
  try {
    // Fetch all Kanto region Pokémon (151 total)
    const response = await fetch('https://pokeapi.co/api/v2/pokedex/kanto');
    const data = await response.json();
    const pokemonList = data.pokemon_entries;
    const allPokemon: Pokemon[] = [];

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

      const sprite = pokemon.sprites.front_default; // front facing image

      const moves = pokemon.moves.map((move: { move: { name: string } }) => move.move.name);

      allPokemon.push({
        id: i + 1,
        name: pokemon.name,
        sprite: sprite,
        currHealth: Math.floor(Math.random() * stats.health + 1),
        health: stats.health,
        attack: stats.attack,
        defense: stats.defense,
        moves: [
          moves[Math.floor(Math.random() * moves.length + 1)],
          moves[Math.floor(Math.random() * moves.length + 1)],
          moves[Math.floor(Math.random() * moves.length + 1)],
          moves[Math.floor(Math.random() * moves.length + 1)],
        ],
      });
    }

    return allPokemon;
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);
    return [];
  }
};
// disabling the linter here because it doesn't detect this as a function and when we follow
// camelCase, it doesn't allow us to call it or use the hooks inside the function.
// eslint-disable-next-line @typescript-eslint/naming-convention
const ParentComponent: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [availablePokemons] = useState<Pokemon[]>([]);
  getPokemon().then(allPokemon => {
    allPokemon.forEach(function (pokemon) {
      availablePokemons.push(pokemon);
    });
  });

  /* Placeholder data FOR NOW. Replace this with API integration whenever we figure out whats wrong. */
  /*{
      id: 1,
      name: 'Pikachu',
      sprite: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      health: 100,
      attack: 50,
      defense: 70,
      moves: ['Thunder Shock', 'Quick Attack', 'Iron Tail', 'Electro Ball'],
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
                src={pokemon.sprite}
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
                    width: `${(pokemon.currHealth / pokemon.health) * 100}%`,
                    backgroundColor: '#4caf50',
                    height: '100%',
                  }}></div>
              </div>
              <p>
                {pokemon.currHealth} / {pokemon.health} HP
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedPokemon && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Selected Pokémon: {selectedPokemon.name}</h2>
          <img
            src={selectedPokemon.sprite}
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
