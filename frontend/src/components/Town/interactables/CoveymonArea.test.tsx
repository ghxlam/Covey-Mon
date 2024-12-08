import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import { mock, MockProxy } from 'jest-mock-extended';
import TownController from '../../../classes/TownController';
import TownControllerContext from '../../../contexts/TownControllerContext';
import CoveymonAreaModal from './CoveymonArea';

jest.mock('../../../classes/TownController', () => ({
  __esModule: true,
  useInteractable: jest.fn(() => true),
}));

describe('CoveymonAreaModal', () => {
  let mockTownController: MockProxy<TownController>;

  beforeEach(() => {
    mockTownController = mock<TownController>();
    Object.defineProperty(mockTownController, 'userID', {
      value: 'test-user',
      writable: false, // Ensures it behaves like a read-only property
    });
    mockTownController.pause.mockImplementation(jest.fn());
    mockTownController.unPause.mockImplementation(jest.fn());
    mockTownController.interactEnd.mockImplementation(jest.fn());
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const renderWithContext = () => {
    render(
      <ChakraProvider>
        <TownControllerContext.Provider value={mockTownController}>
          <CoveymonAreaModal />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );
  };

  it('renders the modal when coveymon is set', () => {
    renderWithContext();
    // Ensure the modal with the "Join the Game" header is present
    expect(screen.getByText('Join the Game')).toBeInTheDocument();
  });

  it('renders the Join Game button', () => {
    renderWithContext();
    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    expect(joinGameButton).toBeInTheDocument();
    expect(joinGameButton).toBeEnabled();
  });

  it('closes the modal when close button is clicked', () => {
    renderWithContext();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    // Ensure the unPause function was called
    expect(mockTownController.unPause).toHaveBeenCalled();
    // Ensure the modal content disappears
    expect(screen.queryByText('Join the Game')).not.toBeInTheDocument();
  });

  it('shows pokedex when the game is in progress', () => {
    renderWithContext();

    // Simulate clicking "Join Game"
    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    // Ensure pokedex message is displayed
    expect(screen.getByText('Press on a pokemon to see their stats.')).toBeInTheDocument();
  });
});
