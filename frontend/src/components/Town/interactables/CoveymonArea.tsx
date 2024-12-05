import React, { useCallback, useEffect, useState } from 'react';
import useTownController from '../../../hooks/useTownController';
import { Player } from '../../../types/CoveyTownSocket'; // Import Player type
import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import Pokedex from './Pokedex'; // Import the Pokedex component
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useInteractable } from '../../../classes/TownController';

function useCoveymonAreaController() {
  const townController = useTownController();
  if (townController.coveymonAreas.length) {
    return townController.coveymonAreas[0] as CoveymonAreaController;
  }
  throw new Error('This is broken!');
}

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'gameInProgress'>('waiting');
  const [players, setPlayers] = useState<Player[]>([]);

  const coveymon = useInteractable('coveymonArea');
  const coveyTownController = useTownController();
  const toast = useToast();

  const coveymonAreaController = useCoveymonAreaController();

  useEffect(() => {
    if (coveymon) {
      setIsOpen(true);
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveymon, coveyTownController]);

  useEffect(() => {
    const handlePlayersUpdated = (newPlayers: Player[]) => {
      console.log('New Player Found!');
      setPlayers(newPlayers);
    };
    coveymonAreaController.addListener('playersUpdated', handlePlayersUpdated);
    return () => {
      coveymonAreaController.removeListener('playersUpdated', handlePlayersUpdated);
    };
  }, [coveymonAreaController]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (coveymon) {
      coveyTownController.interactEnd(coveymon);
    }
    coveyTownController.unPause();
    setGameState('waiting');
  }, [coveymon, coveyTownController]);

  const handleJoinGame = useCallback(async () => {
    if (!coveymonAreaController) {
      toast({
        title: 'Error',
        description: 'Game controller is not initialized.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await coveymonAreaController.joinGame();
      toast({
        title: 'Success',
        description: 'Welcome to pokedex, Press on a pokemon to see their stats.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setGameState('gameInProgress');
    } catch (err) {
      toast({
        title: 'Error joining game',
        description: (err as Error).message || 'An unexpected error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [coveymonAreaController, toast]);

  return (
    <>
      {/* Main Modal for Coveymon Area */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          {gameState === 'waiting' && (
            <>
              <ModalHeader>Join the Game</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p style={{ marginBottom: '1rem' }}>
                  Click the button below to join the game once ready!
                </p>
                <Button colorScheme='blue' size='lg' onClick={handleJoinGame}>
                  Join Game
                </Button>
              </ModalBody>
            </>
          )}
          {gameState === 'gameInProgress' && (
            <>
              <ModalHeader></ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Pokedex />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
