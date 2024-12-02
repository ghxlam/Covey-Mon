import React, { useCallback, useEffect, useState } from 'react';
import useTownController from '../../../hooks/useTownController';
import { Player } from '../../../types/CoveyTownSocket'; // Import Player type
import CoveymonAreaController from '../../../classes/CoveymonAreaController';
import CoveymonBattles from './CoveymonBattles'; // Import the CoveymonBattles component
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
  const [isBattlesModalOpen, setBattlesModalOpen] = useState(false); // State to control the CoveymonBattles modal
  const [players, setPlayers] = useState<Player[]>([]); // State for players in the game

  const coveymon = useInteractable('coveymonArea'); // Interact with CoveymonArea directly
  const coveyTownController = useTownController(); // Access TownController
  const toast = useToast();

  // Initialize CoveymonAreaController
  const [coveymonAreaController, setCoveymonAreaController] =
    useState<CoveymonAreaController | null>(null);

  useEffect(() => {
    if (coveyTownController?.userID) {
      const controller = new CoveymonAreaController(
        coveyTownController.userID,
        coveyTownController,
      );
      setCoveymonAreaController(controller);

      // Update players immediately after initializing the controller
      setPlayers(controller.players);

      // Register event listener for playersUpdated
      const handlePlayersUpdated = (newPlayers: Player[]) => {
        setPlayers(newPlayers);
      };

      controller.addListener('playersUpdated', handlePlayersUpdated);

      // Cleanup the listener when the component unmounts or coveyTownController changes
      return () => {
        controller.removeListener('playersUpdated', handlePlayersUpdated);
      };
    }
  }, [coveyTownController]);

  // Open modal when interacting with Coveymon area
  useEffect(() => {
    if (coveymon) {
      setIsOpen(true);
      coveyTownController.pause();
    }
  }, [coveymon, coveyTownController]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (coveymon) {
      coveyTownController.interactEnd(coveymon); // End the interaction
    }
    coveyTownController.unPause(); // Unpause the game when modal is closed
    setGameState('waiting'); // Reset the game state to waiting
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
        description: 'You have successfully joined the game!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setGameState('gameInProgress');
      setBattlesModalOpen(true); // Open battles modal
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
                <Button
                  colorScheme='blue'
                  size='lg'
                  onClick={handleJoinGame}
                  isDisabled={!coveymonAreaController}>
                  Join Game
                </Button>
              </ModalBody>
            </>
          )}
          {gameState === 'gameInProgress' && (
            <>
              <ModalHeader>Game In Progress</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* Pass the players array to CoveymonBattles */}
                <CoveymonBattles players={players} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
