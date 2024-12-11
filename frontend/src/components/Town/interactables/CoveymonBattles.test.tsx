import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ParentComponent from './CoveymonBattles';
import getPokemon from './api/PokeApi';

jest.mock('./api/PokeApi');

const mockGetPokemon = getPokemon as jest.Mock;
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: () => mockToast,
  };
});

describe('ParentComponent', () => {
  beforeEach(() => {
    mockGetPokemon.mockResolvedValue([
      {
        id: 1,
        name: 'Bulbasaur',
        sprite: '/bulbasaur.png',
        currHealth: 45,
        health: 45,
        attack: 49,
        defense: 49,
        maxHealth: 45,
        moves: [
          { name: 'Tackle', power: 40 },
          { name: 'Vine Whip', power: 45 },
        ],
      },
      {
        id: 2,
        name: 'Charmander',
        sprite: '/charmander.png',
        currHealth: 39,
        health: 39,
        attack: 52,
        defense: 43,
        maxHealth: 39,
        moves: [
          { name: 'Scratch', power: 40 },
          { name: 'Ember', power: 40 },
        ],
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders available Pokémon and allows selection', async () => {
    render(
      <ChakraProvider>
        <ParentComponent />
      </ChakraProvider>,
    );

    expect(await screen.findByText('Available Pokemon:')).toBeInTheDocument();

    const bulbasaur = await screen.findByText('Bulbasaur');
    expect(bulbasaur).toBeInTheDocument();

    fireEvent.click(bulbasaur);

    const startBattleButton = screen.getByRole('button', { name: 'Start Battle' });
    expect(startBattleButton).toBeEnabled();
  });

  it('starts a battle and displays the opponent Pokémon', async () => {
    render(
      <ChakraProvider>
        <ParentComponent />
      </ChakraProvider>,
    );

    const bulbasaur = await screen.findByText('Bulbasaur');
    fireEvent.click(bulbasaur);

    const startBattleButton = screen.getByRole('button', { name: 'Start Battle' });
    fireEvent.click(startBattleButton);

    expect(await screen.findByText('Your Pokemon: Bulbasaur')).toBeInTheDocument();
    expect(await screen.findByText('Opponent Pokemon:')).toBeInTheDocument();
  });

  it('handles player moves and updates battle log', async () => {
    render(
      <ChakraProvider>
        <ParentComponent />
      </ChakraProvider>,
    );

    const bulbasaur = await screen.findByText('Bulbasaur');
    fireEvent.click(bulbasaur);

    const startBattleButton = screen.getByRole('button', { name: 'Start Battle' });
    fireEvent.click(startBattleButton);

    const tackleButton = await screen.findByRole('button', { name: /Tackle \(Damage: 40\)/ });
    fireEvent.click(tackleButton);

    expect(await screen.findByText(/Bulbasaur used Tackle!/)).toBeInTheDocument();
  });

  it('shows a toast when the player wins or loses', async () => {
    render(
      <ChakraProvider>
        <ParentComponent />
      </ChakraProvider>,
    );

    const bulbasaur = await screen.findByText('Bulbasaur');
    fireEvent.click(bulbasaur);

    const startBattleButton = screen.getByRole('button', { name: 'Start Battle' });
    fireEvent.click(startBattleButton);

    // Simulate the opponent being defeated
    fireEvent.click(screen.getByRole('button', { name: /Tackle \(Damage: 40\)/ }));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringMatching(/You (won|lost)!/) }),
    );
  });
});
