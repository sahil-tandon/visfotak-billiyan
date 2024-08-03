// src/hooks/useGameState.ts
import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, update } from 'firebase/database';
import { rtdb } from '../utils/firebase';
import { GameState, Player, MAX_PLAYERS } from '../utils/gameTypes';
import { createDeck, dealInitialHands } from '../utils/gameLogic';

export const useGameState = (roomCode: string, playerName: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Attempting to connect to room:", roomCode);
    const gameRef = ref(rtdb, `games/${roomCode}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      console.log("Received data from Firebase:", snapshot.val());
      const data = snapshot.val() as GameState | null;
      if (data) {
        console.log("Setting game state:", data);
        // Ensure players array is always initialized
        setGameState({
          ...data,
          players: data.players || []
        });
      }  else {
          console.log("Initializing new game state");
          const initialState: GameState = {
  players: [],
  currentTurn: 0,
  deck: [],
  discardPile: [],
  gameOver: false,
  winner: null,
  currentAction: null,
  gameStarted: false,
  attackTurns: 0,
  favorRequester: null,
  topThreeCards: null,
  lastActionNoped: false  // Add this line
};
        set(gameRef, initialState).then(() => {
          console.log("Initial state set successfully");
          setGameState(initialState);
        }).catch((error) => {
          console.error("Error setting initial state:", error);
          setError(error as Error);
        });
      }
    }, (error) => {
      console.error("Error connecting to Firebase:", error);
      setError(error as Error);
    });

    return () => unsubscribe();
  }, [roomCode]);

  const updateGameState = useCallback((newState: GameState) => {
    console.log("Updating game state:", newState);
    const gameRef = ref(rtdb, `games/${roomCode}`);
    set(gameRef, newState).catch((error) => {
      console.error("Error updating game state:", error);
      setError(error as Error);
    });
  }, [roomCode]);

  const joinGame = useCallback(() => {
    console.log("Joining game. Current state:", gameState);
    if (gameState && !gameState.players.some(p => p.name === playerName) && gameState.players.length < MAX_PLAYERS) {
      const updatedPlayers = [...gameState.players, { name: playerName, hand: [] }];
      console.log("Updated players:", updatedPlayers);
      const gameRef = ref(rtdb, `games/${roomCode}`);
      update(gameRef, { players: updatedPlayers }).then(() => {
        console.log("Successfully joined game");
      }).catch((error) => {
        console.error("Error joining game:", error);
        setError(error as Error);
      });
    } else {
      console.log("Cannot join game. Either player already joined, game is full, or game state is null.");
    }
  }, [gameState, playerName, roomCode]);

  return { gameState, updateGameState, joinGame, error };
};