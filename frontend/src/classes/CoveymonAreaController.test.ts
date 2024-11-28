import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import CoveymonAreaController, { CoveymonAreaEvents } from './CoveymonAreaController';
import PlayerController from './PlayerController';
import TownController from './TownController';

describe('[T1] CoveymonAreaController', () => {
  let testArea: CoveymonAreaController;
  const mockListeners = mock<CoveymonAreaEvents>();
  const mockTownController = mock<TownController>();

  beforeEach(() => {
    testArea = new CoveymonAreaController(nanoid());
    testArea._townController = mockTownController;
    testArea.occupants = [
      new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
      new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
      new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
    ];
    mockClear(mockListeners.occupantsChange);
    testArea.addListener('occupantsChange', mockListeners.occupantsChange);
  });

  describe('joinGame', () => {
    it('should join the game and update the game ID', async () => {
      const gameID = nanoid();
      mockTownController.sendInteractableCommand.mockResolvedValueOnce({ gameID });

      await testArea.joinGame();

      expect(testArea.id).toBe(gameID);
      expect(mockTownController.sendInteractableCommand).toHaveBeenCalledWith(testArea.id, {
        type: 'JoinGame',
      });
    });

    it('should handle errors when joining the game', async () => {
      mockTownController.sendInteractableCommand.mockRejectedValueOnce(new Error('Join failed'));

      await expect(testArea.joinGame()).rejects.toThrow('Join failed');
    });
  });

  describe('leaveGame', () => {
    it('should leave the game and reset the game ID', async () => {
      testArea.toCoveymonAreaModel().id = 'some-game-id';
      mockTownController.sendInteractableCommand.mockResolvedValueOnce({});

      await testArea.leaveGame();

      expect(testArea.id).toBe('');
      expect(mockTownController.sendInteractableCommand).toHaveBeenCalledWith(testArea.id, {
        type: 'LeaveGame',
        gameID: 'some-game-id',
      });
    });

    it('should not send leave command if there is no game ID', async () => {
      testArea.toCoveymonAreaModel().id = '';

      await testArea.leaveGame();

      expect(mockTownController.sendInteractableCommand).not.toHaveBeenCalled();
    });
  });

  describe('setting the occupants property', () => {
    it('emits the playerJoined event when a new player joins', () => {
      const newPlayer = new PlayerController(nanoid(), nanoid(), {
        moving: false,
        x: 0,
        y: 0,
        rotation: 'front',
      });
      const newOccupants = testArea.occupants.concat(newPlayer);
      testArea.occupants = newOccupants;

      expect(mockListeners.occupantsChange).toHaveBeenCalledWith(newOccupants);
      expect(mockListeners.playerJoined).toHaveBeenCalledWith(newPlayer);
    });

    it('does not emit the event when occupants remain the same', () => {
      const originalOccupants = testArea.occupants;
      testArea.occupants = [...originalOccupants];

      expect(mockListeners.occupantsChange).not.toHaveBeenCalled();
    });
  });
});
