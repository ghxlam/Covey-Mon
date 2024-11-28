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

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false); // Manage modal visibility
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'underConstruction'>('idle'); // Manage game state
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
    }
  }, [coveymon, openModal]);

  const handleJoinGame = () => {
    setGameState('waiting'); // Transition to waiting state
    // Example: Listen for an event when another player joins
    coveyTownController.onPlayerJoined(() => {
      setGameState('underConstruction'); // Transition to under construction when the event occurs
    });
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
              <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
          </>
        )}

        {gameState === 'underConstruction' && (
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
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModal}>Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
