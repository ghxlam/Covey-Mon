export default class Pokemon {
  public name: string;

  public pokemonType: string[];

  private _pokemonMaxHealth: number;

  public pokemonCurrentHealth: number;

  public pokemonSpeed: number;

  public pokemonDefense: number;

  public pokemonAttack: number;


  private pokemonMoves: string[] = ["tackle","bite","punch","kick"]; // figure out how to set moves

  private pokemonMovesPower: number[] = [40,20,30,50];

  
  constructor (
    name: string,
    Type: string[],
    maxHealth: number,
    currentHealth: number,
    speed: number,
    defense: number,
    attack: number,
  ) {
    this.pokemonType = Type;
    this._pokemonMaxHealth = maxHealth;
    this.pokemonCurrentHealth = currentHealth;
    this.pokemonSpeed = speed;
    this.pokemonDefense = defense;
    this.pokemonAttack = attack;
    this.name = name;
  }

  public getMoves(): string[]{
    return this.pokemonMoves;
  }

  public getMovesPower(move: string): number{
    for(let i=0; i<this.getMoves.length; i++){
      if(move === this.pokemonMoves[i]){
        return this.pokemonMovesPower[i];
      }
    }
    return -1; // if you get -1 then there is an error
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

  public getname(): string{
    return this.name;
  }

  public takeDamage(Damage: number) {
    this.pokemonCurrentHealth -= Damage;
  }
}
