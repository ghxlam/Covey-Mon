import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import {
  BoundingBox,
  CoveymonArea as ConveymonAreaModel,
  TownEmitter,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class CoveymonArea extends InteractableArea {
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
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new CoveymonArea({ id: name, occupantsByID: [] }, rect, broadcastEmitter);
  }
}
