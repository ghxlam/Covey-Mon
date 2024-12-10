import Pokemon from './Pokemon';

describe('Pokemon', () => {
  let pokemon: Pokemon;
  let pokemon2: Pokemon;

  beforeEach(() => {
    // Setting up a test Pokemon object before each test
    pokemon = new Pokemon('Pikachu', ['Electric'], 100, 100, 90, 40, 55); // name, type, max health, current health, speed, defense, attack
    pokemon2 = new Pokemon('Bulbasaur', ['Grass', 'Poison'], 95, 0, 112, 35, 60);
  });

  describe('creates a pokemon', () => {
    it('should create a Pokemon instance with the correct properties', () => {
      expect(pokemon.getname()).toBe('Pikachu');
      expect(pokemon.getType()).toEqual(['Electric']);
      expect(pokemon.getMaxHealth()).toBe(100);
      expect(pokemon.getCurrentHealth()).toBe(100);
      expect(pokemon.getSpeed()).toBe(90);
      expect(pokemon.getDefense()).toBe(40);
      expect(pokemon.getAttack()).toBe(55);
    });

    it('Pokemon can have two types', () => {
      expect(pokemon2.getType()).toEqual(['Grass', 'Poison']);
    });
  });
  describe('checks if pokemon is alive', () => {
    it('should return true if the Pokemon is alive', () => {
      expect(pokemon.isAlive()).toBe(true);
    });

    it('should return false if the Pokemon is not alive', () => {
      pokemon.setCurrentHealth(0);
      expect(pokemon.isAlive()).toBe(false);
    });
  });
  describe('checks if health can be set correctly', () => {
    it('should set the current health correctly', () => {
      pokemon.setCurrentHealth(50);
      expect(pokemon.getCurrentHealth()).toBe(50);
    });
  });
  describe('checks if pokemon can take damage', () => {
    it('tests if a pokemon can take damage correctly', () => {
      pokemon.setCurrentHealth(50);
      pokemon.takeDamage(20);
      expect(pokemon.getCurrentHealth()).toBe(30);
    });

    it('pokemon can take lethal damage', () => {
      pokemon.setCurrentHealth(50);
      pokemon.takeDamage(50);
      expect(pokemon.getCurrentHealth()).toBe(0);
      expect(pokemon.isAlive()).toBe(false);
    });
  });
});
