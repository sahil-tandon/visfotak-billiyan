// src/hooks/useGameState.ts
import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from '../utils/firebase';
import { GameState, MAX_PLAYERS } from '../utils/gameTypes';
import { createDeck, dealInitialHands } from '../utils/gameLogic';

export const useGameState = (roomCode: string, playerName: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    console.log("Attempting to connect to room:", roomCode);
    const gameRef = ref(rtdb, `games/${roomCode}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      console.log("Received data from Firebase:", snapshot.val());
      const data = snapshot.val() as GameState | null;
      if (data) {
        console.log("Setting game state:", data);
        setGameState(data);
      } else {
        console.log("Initializing new game state");
        const initialDeck = createDeck();
        const initialPlayers = [{ name: playerName, hand: [] }];
        const { players, deck } = dealInitialHands(initialPlayers, initialDeck);
        const initialState: GameState = {
          players,
          currentTurn: 0,
          deck,
          discardPile: [],
          gameOver: false,
          winner: null
        };
        set(gameRef, initialState).then(() => {
          console.log("Initial state set successfully");
          setGameState(initialState);
        }).catch((error) => {
          console.error("Error setting initial state:", error);
        });
      }
    }, (error) => {
      console.error("Error connecting to Firebase:", error);
    });

    return () => unsubscribe();
  }, [roomCode, playerName]);

  const updateGameState = (newState: GameState) => {
    const gameRef = ref(rtdb, `games/${roomCode}`);
    set(gameRef, newState).then(() => {
      console.log("Game state updated successfully");
    }).catch((error) => {
      console.error("Error updating game state:", error);
    });
  };

  return { gameState, updateGameState };
};