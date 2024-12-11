import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { PlayerLocation } from '../types/CoveyTownSocket';
import CoveymonAreaConreoller, { CoveymonAreaEvents } from './CoveymonAreaController';
import PlayerController from './PlayerController';
import TownController from './TownController';
import useLoginController from '../hooks/useLoginController';
describe('[T3] CoveymonAreaController', () => {
  //a coveymon Area to be used for tests
  let testArea: CoveymonAreaConreoller;
  const town = new TownController({
    userName: nanoid(),
    townID: nanoid(),
    loginController: useLoginController(),
  });
  const mockListeners = mock<CoveymonAreaEvents>();

  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    testArea = new CoveymonAreaConreoller(nanoid(), town);
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
    it('Returns false if the occupants list is set and the topic is defined', () => {
      expect(testArea.isEmpty()).toBe(false);
    });
  });
});
