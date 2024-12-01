import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
// import { getLastEmittedEvent } from '../TestUtils';
import { TownEmitter } from '../types/CoveyTownSocket';
import CoveymonArea from './CoveymonArea';

describe('CoveymonArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: CoveymonArea;
  const townEmitter = mock<TownEmitter>();
  const id = nanoid();
  let newPlayer: Player;

  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new CoveymonArea({ id, occupantsByID: [] }, testAreaBox, townEmitter);
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
  });

  describe('join', () => {
    it('Should add a player to the game when the game has less than 2 players', () => {
      testArea.join(newPlayer);

      expect(testArea.players.length).toEqual(1);
    });
    it('Throws an error if the same player joins twice', () => {
      testArea.join(newPlayer);

      expect(() => testArea.join(newPlayer)).toThrowError();
    });
    it('Throws an error if join gets called with a full game', () => {
      testArea.join(new Player(nanoid(), mock<TownEmitter>()));
      testArea.join(new Player(nanoid(), mock<TownEmitter>()));

      expect(() => testArea.join(new Player(nanoid(), mock<TownEmitter>()))).toThrowError();
    });
  });

  describe('leave', () => {
    it('Should remove a player in the game if the player is in the game', () => {
      testArea.join(newPlayer);
      testArea.leave(newPlayer);

      expect(testArea.players.length).toEqual(0);
    });
    it('Throws an error if leave gets called with no players in the game', () => {
      expect(() => testArea.leave(newPlayer)).toThrowError();
    });
  });

  describe('fromMapObject', () => {
    it('Throws an error if the width or height are missing', () => {
      expect(() =>
        CoveymonArea.fromMapObject(
          { id: 1, name: nanoid(), visible: true, x: 0, y: 0 },
          townEmitter,
        ),
      ).toThrowError();
    });
    it('Creates a new conversation area using the provided boundingBox and id, with an empty occupants list', () => {
      const x = 30;
      const y = 20;
      const width = 10;
      const height = 20;
      const name = 'name';
      const val = CoveymonArea.fromMapObject(
        { x, y, width, height, name, id: 10, visible: true },
        townEmitter,
      );
      expect(val.boundingBox).toEqual({ x, y, width, height });
      expect(val.id).toEqual(name);
      expect(val.occupantsByID).toEqual([]);
    });
  });
});
