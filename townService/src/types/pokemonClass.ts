export default class pokemonClass {
  public pokemonName: string;

  public pokemonType: string[];

  private _pokemonMaxHealth: number;

  public pokemonCurrentHealth: number;

  public pokemonSpeed: number;

  public pokemonDefense: number;

  public pokemonAttack: number;

  // private pokemonMoves: string[][]; // figure out how to set moves

  constructor(
    Name: string,
    Type: string[],
    maxHealth: number,
    currentHealth: number,
    speed: number,
    defense: number,
    attack: number,
  ) {
    this.pokemonName = Name;
    this.pokemonType = Type;
    this._pokemonMaxHealth = maxHealth;
    this.pokemonCurrentHealth = currentHealth;
    this.pokemonSpeed = speed;
    this.pokemonDefense = defense;
    this.pokemonAttack = attack;
  }

  public getPokemonName(): string {
    return this.pokemonName;
  }

  public getPokemonType(): string[] {
    return this.pokemonType;
  }

  public getPokemonMaxHealth(): number {
    return this._pokemonMaxHealth;
  }

  public getPokemonCurrentHealth(): number {
    return this.pokemonCurrentHealth;
  }

  public getPokemonSpeed(): number {
    return this.pokemonSpeed;
  }

  public getPokemonDefense(): number {
    return this.pokemonDefense;
  }

  public getPokemonAttack(): number {
    return this.pokemonAttack;
  }

  public isAlive(): boolean {
    if (this.pokemonCurrentHealth > 0) {
      return true;
    }
    return false;
  }

  public setPokemonCurrentHealth(health: number) {
    this.pokemonCurrentHealth = health;
  }
}
