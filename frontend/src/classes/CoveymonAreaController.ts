import EventEmitter from 'events';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import { CoveymonArea as CoveymonAreaModel } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

export type CoveyMonAreaEvents = {
  occupantsChange: (newOccupants: PlayerController[]) => void;
};

export default class CoveymonAreaController extends (EventEmitter as new () => TypedEmitter<CoveyMonAreaEvents>) {
  private _occupants: PlayerController[] = [];

  private _id: string;

  constructor(id: string) {
    super();
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set occupants(newOccupants: PlayerController[]) {
    if (
      newOccupants.length !== this._occupants.length ||
      _.xor(newOccupants, this._occupants).length > 0
    ) {
      this.emit('occupantsChange', newOccupants);
      this._occupants = newOccupants;
    }
  }

  get occupants() {
    return this._occupants;
  }

  isEmpty(): boolean {
    return this._occupants.length === 0;
  }

  toCoveymonAreaModel(): CoveymonAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupants.map(player => player.id),
    };
  }

  static fromConveymonAreaModel(
    coveymAreaModel: CoveymonAreaModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ): CoveymonAreaController {
    const ret = new CoveymonAreaController(coveymAreaModel.id);
    ret.occupants = playerFinder(coveymAreaModel.occupantsByID);
    return ret;
  }
}

export function useCoveymonAreaOccupants(area: CoveymonAreaController): PlayerController[] {
  const [occupants, setOccupants] = useState(area.occupants);
  useEffect(() => {
    area.addListener('occupantsChange', setOccupants);
    return () => {
      area.removeListener('occupantsChange', setOccupants);
    };
  }, [area]);
  return occupants;
}
