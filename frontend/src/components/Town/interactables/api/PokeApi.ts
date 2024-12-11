import { Pokemon } from '../../../../types/CoveyTownSocket';

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

/**
 * This is the API call that will fetch all Pokemon data from the API's PokeDex.
 * It manages to fetch the name, health, moves, power, and other useful stats that were used during the game's implementation.
 *
 * @returns an array called allPokemon which is of type Pokemon which holds all the data we need.
 */
const getPokemon = async (): Promise<Pokemon[]> => {
  try {
    // Fetch all Kanto region Pokemon that are max evolved (63 total)
    const response = await fetch('https://pokeapi.co/api/v2/pokedex/kanto');
    const data = await response.json();
    const pokemonList = data.pokemon_entries;
    const allPokemon: Pokemon[] = [];

    // Function to fetch move details
    const getMovePower = async (moveName: string): Promise<number | null> => {
      try {
        const moveResponse = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        const moveData = await moveResponse.json();
        return moveData.power || null;
      } catch (error) {
        console.error('Error fetching move data:', error);
        return null;
      }
    };

    const getEvolutionChain = async (speciesUrl: string): Promise<boolean> => {
      try {
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainResponse.json();

        let currentEvolution = evolutionChainData.chain;
        while (currentEvolution.evolves_to.length > 0) {
          currentEvolution = currentEvolution.evolves_to[0];
        }

        return currentEvolution.species.name === speciesData.name;
      } catch (error) {
        console.error('Error fetching evolution chain data:', error);
        return false;
      }
    };

    for (const entry of pokemonList) {
      const pokemonName = entry.pokemon_species.name;
      const pokemonDataResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = await pokemonDataResponse.json();

      const isFinalEvolution = await getEvolutionChain(pokemonData.species.url);
      if (!isFinalEvolution) {
        continue;
      }

      const stats = pokemonData.stats.reduce(
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

      const sprite = pokemonData.sprites.front_default; // Default front-facing image

      const moves = await Promise.all(
        pokemonData.moves.slice(0, 4).map(async (move: { move: { name: string } }) => ({
          name: move.move.name,
          power: await getMovePower(move.move.name),
        })),
      );

      allPokemon.push({
        id: entry.entry_number,
        name: pokemonData.name,
        sprite: sprite,
        currHealth: stats.health,
        health: stats.health,
        maxHealth: stats.health,
        attack: stats.attack,
        defense: stats.defense,
        moves: moves,
      });
    }

    return allPokemon;
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return [];
  }
};

export default getPokemon;
