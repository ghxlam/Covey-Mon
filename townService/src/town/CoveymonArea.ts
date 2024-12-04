import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
// import Pokemon from 'covey-town-shared-libraries/types/Pokemon';
import {
  BoundingBox,
  CoveymonArea as ConveymonAreaModel,
  Player as GamePlayer,
  TownEmitter,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

import Player from '../lib/Player';

export default class CoveymonArea extends InteractableArea {
  private _players: GamePlayer[] = [];

  public get isActive(): boolean {
    return this._occupants.length > 0;
  }

  public constructor(
    { id }: ConveymonAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
  }

  get players() {
    return this._players;
  }

  public join(player: GamePlayer) {
    if (this._players.length === 2) {
      throw new Error('The game is full!');
    }

    const playerExists = this._players.find(currentPlayer => currentPlayer.id === player.id);
    if (playerExists) {
      throw new Error('The same player cannot join twice!');
    }

    this._players.push(player);
  }

  public leave(player: GamePlayer) {
    if (this._players.length === 0) {
      throw new Error('The game is already empty!');
    }
    this._players = this._players.filter(currentPlayer => currentPlayer.id !== player.id);
  }

  // getting errors with attack, will fix later

  /* public Attack(attackingcoveymon: Pokemon, move: string, defendingCoveymon: Pokemon) {
    let crit = 0;
    if (Math.random() * 100 >= 7) {
      // calculates the critical hit chance for the pokemon
      crit = 2;
    } else {
      crit = 1;
    }
    // 50 is the level of the pokemon, we are assuming the level is 50, this can be changed later
    const damage =
      (((2 * 50 * crit) / 5 + 2) *
        attackingcoveymon.getMovesPower(move) *
        (attackingcoveymon.getAttack() / defendingCoveymon.getDefense())) /
        50 +
      2;
    if (damage === 1) {
      return 1;
    }
    const random = Math.floor(Math.random() * (255 - 217 + 1) + 217) / 255;
    defendingCoveymon.takeDamage(damage * random);
  } */

  public remove(player: Player) {
    super.remove(player);
    if (this._occupants.length === 0) {
      this._emitAreaChanged();
    }
  }

  public toModel(): ConveymonAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
    };
  }

  public static fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): CoveymonArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed CoveymonArea area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new CoveymonArea({ id: name, occupantsByID: [] }, rect, broadcastEmitter);
  }
}
