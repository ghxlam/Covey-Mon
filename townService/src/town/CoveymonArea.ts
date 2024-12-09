import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
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

    // make it so that player gets pokemon assigned when joining
    this._players.push(player);
  }

  public leave(player: GamePlayer) {
    if (this._players.length === 0) {
      throw new Error('The game is already empty!');
    }
    this._players = this._players.filter(currentPlayer => currentPlayer.id !== player.id);
  }

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
