import EventEmitter from 'events';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import { CoveymonArea as CoveymonAreaModel } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';
import TownController from './TownController';

export type CoveymonAreaEvents = {
  occupantsChange: (newOccupants: PlayerController[]) => void;
  playerJoined: (newPlayer: PlayerController) => void;
};

export const PLAYER_NOT_IN_GAME_ERROR = 'Player is not in game';
export const NO_GAME_IN_PROGRESS_ERROR = 'No game in progress';

export default class CoveymonAreaController extends (EventEmitter as new () => TypedEmitter<CoveymonAreaEvents>) {
  private _occupants: PlayerController[] = [];

  private _id: string;

  private _townController: TownController; // Added TownController

  protected _players: PlayerController[] = [];

  constructor(id: string, townController: TownController) {
    super();
    this._id = id;
    this._townController = townController;
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

  static fromCoveymonAreaModel(
    coveymAreaModel: CoveymonAreaModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
    townController: TownController, // Added townController parameter
  ): CoveymonAreaController {
    const ret = new CoveymonAreaController(coveymAreaModel.id, townController); // Pass TownController here
    ret.occupants = playerFinder(coveymAreaModel.occupantsByID);
    return ret;
  }

  /**
   * Sends a request to the server to join the current game in the game area, or create a new one if there is no game in progress.
   *
   * @throws An error if the server rejects the request to join the game.
   */
  public async joinGame(): Promise<void> {
    try {
      // Now using the _townController to emit the game update
      this._townController.emitCovemonGameUpdate({
        id: this._id,
        type: 'JOIN',
        player: this._townController.ourPlayer,
      });
    } catch (error) {
      // Log or rethrow the error for the caller to handle
      throw new Error(`Error joining the game: ${(error as Error).message}`);
    }
  }

  /**
   * Sends a request to the server to leave the current game in the game area.
   */
  public async leaveGame() {
    try {
      // Using the _townController to emit the game update for leaving the game
      this._townController.emitCovemonGameUpdate({
        id: this._id,
        type: 'LEAVE',
        player: this._townController.ourPlayer,
      });
    } catch (error) {
      // Log or rethrow the error for the caller to handle
      throw new Error(`Error leaving the game: ${(error as Error).message}`);
    }
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
