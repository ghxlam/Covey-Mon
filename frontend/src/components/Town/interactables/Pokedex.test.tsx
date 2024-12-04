import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CoveymonAreaModal from './CoveymonAreaModal';
import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import useTownController from '../../../hooks/useTownController';
import { useInteractable } from '../../../classes/TownController';

// Mock dependencies
jest.mock('../../../hooks/useTownController');
jest.mock('../../../classes/TownController', () => ({
  useInteractable: jest.fn(),
}));

const mockUseTownController = useTownController as jest.Mock;
const mockUseInteractable = useInteractable as jest.Mock;

// Mock data
const mockController = {
  userID: 'testUser',
  pause: jest.fn(),
  unPause: jest.fn(),
  interactEnd: jest.fn(),
};

const mockCoveymonAreaController = {
  players: [],
  addListener: jest.fn(),
  removeListener: jest.fn(),
  joinGame: jest.fn(),
};

describe('CoveymonAreaModal', () => {
  beforeEach(() => {
    mockUseTownController.mockReturnValue(mockController);
    mockUseInteractable.mockReturnValue(null); // Default no interaction
    jest.clearAllMocks();
  });

  it('renders the modal closed initially', () => {
    render(<CoveymonAreaModal />);
    expect(screen.queryByText(/join the game/i)).not.toBeInTheDocument();
  });

  it('opens the modal when coveymon interaction is triggered', () => {
    mockUseInteractable.mockReturnValueOnce('coveymonArea');
    render(<CoveymonAreaModal />);
    expect(screen.getByText(/join the game/i)).toBeInTheDocument();
  });

  it('calls pause on the town controller when the modal opens', () => {
    mockUseInteractable.mockReturnValueOnce('coveymonArea');
    render(<CoveymonAreaModal />);
    expect(mockController.pause).toHaveBeenCalledTimes(1);
  });

  it('closes the modal and resets the state when the close button is clicked', () => {
    mockUseInteractable.mockReturnValueOnce('coveymonArea');
    render(<CoveymonAreaModal />);
    fireEvent.click(screen.getByLabelText(/close/i)); // Close button
    expect(mockController.unPause).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/join the game/i)).not.toBeInTheDocument();
  });

  it('disables the join button if the game controller is not initialized', () => {
    render(<CoveymonAreaModal />);
    expect(screen.getByRole('button', { name: /join game/i })).toBeDisabled();
  });

  it('handles successful game joining', async () => {
    mockCoveymonAreaController.joinGame.mockResolvedValueOnce(undefined);
    jest
      .spyOn(CoveymonAreaController.prototype, 'joinGame')
      .mockImplementation(() => mockCoveymonAreaController.joinGame());
    mockUseInteractable.mockReturnValueOnce('coveymonArea');

    render(<CoveymonAreaModal />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /join game/i }));
    });

    expect(screen.queryByText(/welcome to pokedex/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /join game/i })).not.toBeInTheDocument();
  });

  it('handles errors when joining the game', async () => {
    const errorMessage = 'Failed to join game';
    mockCoveymonAreaController.joinGame.mockRejectedValueOnce(new Error(errorMessage));
    jest
      .spyOn(CoveymonAreaController.prototype, 'joinGame')
      .mockImplementation(() => mockCoveymonAreaController.joinGame());
    mockUseInteractable.mockReturnValueOnce('coveymonArea');

    render(<CoveymonAreaModal />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /join game/i }));
    });

    expect(screen.queryByText(/error joining game/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
