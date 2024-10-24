import PokemonClass from './pokemonClass';

describe('PokemonClass', () => {
  let pokemon: PokemonClass;
  let pokemon2: PokemonClass;

  beforeEach(() => {
    // Setting up a test Pokemon object before each test
    pokemon = new PokemonClass('Pikachu', ['Electric'], 100, 100, 90, 40, 55); // name, type, max health, current health, speed, defense, attack
    pokemon2 = new PokemonClass('Bulbasaur', ['Grass', 'Poison'], 95, 0, 112, 35, 60);
  });

  describe('creates a pokemon', () => {
    it('should create a Pokemon instance with the correct properties', () => {
      expect(pokemon.getPokemonName()).toBe('Pikachu');
      expect(pokemon.getPokemonType()).toEqual(['Electric']);
      expect(pokemon.getPokemonMaxHealth()).toBe(100);
      expect(pokemon.getPokemonCurrentHealth()).toBe(100);
      expect(pokemon.getPokemonSpeed()).toBe(90);
      expect(pokemon.getPokemonDefense()).toBe(40);
      expect(pokemon.getPokemonAttack()).toBe(55);
    });

    it('Pokemon can have two types', () => {
      expect(pokemon2.getPokemonType()).toEqual(['Grass', 'Poison']);
    });
  });
  describe('checks if pokemon is alive', () => {
    it('should return true if the Pokemon is alive', () => {
      expect(pokemon.isAlive()).toBe(true);
    });

    it('should return false if the Pokemon is not alive', () => {
      pokemon.setPokemonCurrentHealth(0);
      expect(pokemon.isAlive()).toBe(false);
    });
  });
  describe('checks if health can be set correctly', () => {
    it('should set the current health correctly', () => {
      pokemon.setPokemonCurrentHealth(50);
      expect(pokemon.getPokemonCurrentHealth()).toBe(50);
    });
  });
  describe('checks if pokemon can take damage', () => {
    it('tests if a pokemon can take damage correctly', () => {
      pokemon.setPokemonCurrentHealth(50);
      pokemon.takeDamage(20);
      expect(pokemon.getPokemonCurrentHealth()).toBe(30);
    });

    it('pokemon can take lethal damage', () => {
      pokemon.setPokemonCurrentHealth(50);
      pokemon.takeDamage(50);
      expect(pokemon.getPokemonCurrentHealth()).toBe(0);
      expect(pokemon.isAlive()).toBe(false);
    });
  });
});
