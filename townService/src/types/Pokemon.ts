export default class Pokemon {
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

  public getName(): string {
    return this.pokemonName;
  }

  public getType(): string[] {
    return this.pokemonType;
  }

  public getMaxHealth(): number {
    return this._pokemonMaxHealth;
  }

  public getCurrentHealth(): number {
    return this.pokemonCurrentHealth;
  }

  public getSpeed(): number {
    return this.pokemonSpeed;
  }

  public getDefense(): number {
    return this.pokemonDefense;
  }

  public getAttack(): number {
    return this.pokemonAttack;
  }

  public isAlive(): boolean {
    if (this.pokemonCurrentHealth > 0) {
      return true;
    }
    return false;
  }

  public setCurrentHealth(health: number) {
    this.pokemonCurrentHealth = health;
  }

  public takeDamage(Damage: number) {
    this.pokemonCurrentHealth -= Damage;
  }
}
