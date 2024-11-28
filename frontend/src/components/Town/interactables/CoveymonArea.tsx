import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import useTownController from '../../../hooks/useTownController';
import { useInteractable } from '../../../classes/TownController';
import CoveymonBattles from './CoveymonBattles'; // Import the CoveymonBattles component
import CoveymonAreaController from '../../../classes/CoveymonAreaController'; // Import the CoveymonAreaController

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'underConstruction'>('idle');
  const [coveymonAreaController, setCoveymonAreaController] =
    useState<CoveymonAreaController | null>(null);
  const coveymon = useInteractable('coveymonArea');
  const coveyTownController = useTownController();

  const openModal = useCallback(() => {
    setIsOpen(true);
    coveyTownController.pause(); // Pause the game when modal is opened
  }, [coveyTownController]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (coveymon) {
      coveyTownController.interactEnd(coveymon); // End the interaction
    }
    coveyTownController.unPause(); // Unpause the game when modal is closed
    setGameState('idle'); // Reset the game state
  }, [coveymon, coveyTownController]);

  // Detect if we are interacting with a Coveymon area and open the modal
  useEffect(() => {
    if (coveymon) {
      openModal();
      // Initialize the CoveymonAreaController here, you may need to adapt this logic to your actual setup
      const newCoveymonAreaController = new CoveymonAreaController(coveymon.id);
      setCoveymonAreaController(newCoveymonAreaController);
    }
  }, [coveymon, openModal]);

  // Handle join game logic
  const handleJoinGame = () => {
    if (coveymonAreaController) {
      setGameState('waiting');
      // Simulate joining the game (you can replace this with actual join logic)
      coveymonAreaController.joinGame().then(() => {
        setGameState('underConstruction');
      });
    }
  };

  // Handle leave game logic
  const handleLeaveGame = () => {
    if (coveymonAreaController) {
      setGameState('idle');
      coveymonAreaController.leaveGame();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        {gameState === 'idle' && (
          <>
            <ModalHeader>Join Game</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Click the button below to join the game.</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' onClick={handleJoinGame}>
                Join Game
              </Button>
              <Button onClick={closeModal}>Close</Button>
            </ModalFooter>
          </>
        )}

        {gameState === 'waiting' && (
          <>
            <ModalHeader>Waiting for Other Player</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Spinner size='xl' />
              <p style={{ marginTop: '1rem' }}>Waiting for another player to join...</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleLeaveGame}>Leave Game</Button>
            </ModalFooter>
          </>
        )}

        {gameState === 'underConstruction' && coveymonAreaController && (
          <>
            <ModalHeader>Under Construction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}>
                Under Construction
              </div>
              <CoveymonBattles coveymonAreaController={coveymonAreaController} />{' '}
              {/* Render CoveymonBattles */}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleLeaveGame}>Leave Game</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
