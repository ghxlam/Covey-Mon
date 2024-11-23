import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { PlayerLocation } from '../types/CoveyTownSocket';
import CoveymonAreaController, { CoveyMonAreaEvents } from './CoveymonAreaController';
import PlayerController from './PlayerController';

describe('[T1] CoveymonAreaController', () => {
  let testArea: CoveymonAreaController;
  const mockListeners = mock<CoveyMonAreaEvents>();
  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    testArea = new CoveymonAreaController(nanoid());
    testArea = new CoveymonAreaController(nanoid());
    testArea.occupants = [
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
    ];
    mockClear(mockListeners.occupantsChange);
    testArea.addListener('occupantsChange', mockListeners.occupantsChange);
  });
  describe('isEmpty', () => {
    it('Returns true if the occupants list is empty', () => {
      testArea.occupants = [];
      expect(testArea.isEmpty()).toBe(true);
    });
  });
  describe('setting the occupants property', () => {
    it('does not update the property if the new occupants are the same set as the old', () => {
      const origOccupants = testArea.occupants;
      const occupantsCopy = testArea.occupants.concat([]);
      const shuffledOccupants = occupantsCopy.reverse();
      testArea.occupants = shuffledOccupants;
      expect(testArea.occupants).toEqual(origOccupants);
      expect(mockListeners.occupantsChange).not.toBeCalled();
    });
    it('emits the occupantsChange event when setting the property and updates the model', () => {
      const newOccupants = testArea.occupants.slice(1);
      testArea.occupants = newOccupants;
      expect(testArea.occupants).toEqual(newOccupants);
      expect(mockListeners.occupantsChange).toBeCalledWith(newOccupants);
      expect(testArea.toCoveymonAreaModel()).toEqual({
        id: testArea.id,
        occupantsByID: testArea.occupants.map(eachOccupant => eachOccupant.id),
      });
    });
  });
});
