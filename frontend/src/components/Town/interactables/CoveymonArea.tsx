import React, { useCallback, useEffect, useState } from 'react';
import useTownController from '../../../hooks/useTownController';
import { Player } from '../../../types/CoveyTownSocket';
import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import ParentComponent from './CoveymonBattles';
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

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'gameInProgress'>('waiting');
  const [, setPlayers] = useState<Player[]>([]);
  const coveymon = useInteractable('coveymonArea');
  const coveyTownController = useTownController();
  const toast = useToast();

  const [coveymonAreaController, setCoveymonAreaController] =
    useState<CoveymonAreaController | null>(null);

  useEffect(() => {
    if (coveyTownController?.userID) {
      const controller = new CoveymonAreaController(
        coveyTownController.userID,
        coveyTownController,
      );
      setCoveymonAreaController(controller);

      setPlayers(controller.players);

      const handlePlayersUpdated = (newPlayers: Player[]) => {
        setPlayers(newPlayers);
      };

      controller.addListener('playersUpdated', handlePlayersUpdated);

      return () => {
        controller.removeListener('playersUpdated', handlePlayersUpdated);
      };
    }
  }, [coveyTownController]);

  useEffect(() => {
    if (coveymon) {
      setIsOpen(true);
      coveyTownController.pause();
    }
  }, [coveymon, coveyTownController]);

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
        description: 'Welcome to our Pokemon Game, Press on a pokemon to see their stats!',
        status: 'success',
        duration: 3000,
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
              <ModalHeader>Play Pokemon in CoveyTown</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p style={{ marginBottom: '1rem' }}>
                  Click the button below to start the game once ready!
                </p>
                <Button
                  colorScheme='blue'
                  size='lg'
                  onClick={handleJoinGame}
                  isDisabled={!coveymonAreaController}>
                  Start Game
                </Button>
              </ModalBody>
            </>
          )}
          {gameState === 'gameInProgress' && (
            <>
              <ModalHeader></ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <ParentComponent />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
