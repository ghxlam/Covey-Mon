export default class Pokemon {
  public pokemonName: string;

  public userID: string;

  public pokemonType: string[];

  private _pokemonMaxHealth: number;

  public pokemonCurrentHealth: number;

  public pokemonSpeed: number;

  public pokemonDefense: number;

  public pokemonAttack: number;

  private pokemonMoves: string[] = ["tackle","bite","punch","kick"]; // figure out how to set moves

  private pokemonMovesPower: number[] = [40,20,30,50];

  
  constructor(
    Name: string,
    userID: string,
    Type: string[],
    maxHealth: number,
    currentHealth: number,
    speed: number,
    defense: number,
    attack: number,
  ) {
    this.pokemonName = Name;
    this.userID = userID
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

  public getID(): string {
    return this.userID;
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

  public takeDamage(Damage: number) {
    this.pokemonCurrentHealth -= Damage;
  }
}
