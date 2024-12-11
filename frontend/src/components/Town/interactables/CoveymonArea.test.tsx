import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CoveymonAreaModal from './CoveymonArea';
import useTownController from '../../../hooks/useTownController';
import { useInteractable } from '../../../classes/TownController';

jest.mock('../../../hooks/useTownController');
jest.mock('../../../classes/TownController');

const mockUseTownController = useTownController as jest.Mock;
const mockUseInteractable = useInteractable as jest.Mock;

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: () => mockToast,
  };
});

describe('CoveymonAreaModal', () => {
  beforeEach(() => {
    mockUseTownController.mockReturnValue({
      userID: 'testUser',
      pause: jest.fn(),
      unPause: jest.fn(),
      interactEnd: jest.fn(),
    });

    mockUseInteractable.mockReturnValue({ id: 'coveymonArea' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with waiting state by default', () => {
    render(
      <ChakraProvider>
        <CoveymonAreaModal />
      </ChakraProvider>,
    );

    expect(screen.getByText('Play Pokemon in CoveyTown')).toBeInTheDocument();
    expect(
      screen.getByText('Click the button below to start the game once ready!'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Game' })).toBeDisabled();
  });

  it('enables the Start Game button when coveymonAreaController is initialized', () => {
    mockUseTownController.mockReturnValueOnce({
      userID: 'testUser',
      pause: jest.fn(),
      unPause: jest.fn(),
      interactEnd: jest.fn(),
    });

    render(
      <ChakraProvider>
        <CoveymonAreaModal />
      </ChakraProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        description: 'Game controller is not initialized.',
      }),
    );
  });

  it('displays the game in progress when the game starts', async () => {
    render(
      <ChakraProvider>
        <CoveymonAreaModal />
      </ChakraProvider>,
    );

    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Success',
        description: 'Welcome to our Pokemon Game, Press on a pokemon to see their stats!',
      }),
    );

    expect(screen.queryByText('Play Pokemon in CoveyTown')).not.toBeInTheDocument();
    expect(screen.getByText('Your Pokémon:')).toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <ChakraProvider>
        <CoveymonAreaModal />
      </ChakraProvider>,
    );

    fireEvent.click(screen.getByLabelText('Close'));

    expect(mockUseTownController().unPause).toHaveBeenCalled();
  });
});
