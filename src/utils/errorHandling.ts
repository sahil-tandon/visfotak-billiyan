// src/utils/errorHandling.ts
import { ref, onDisconnect } from 'firebase/database';
import { rtdb } from './firebase';

export const handlePlayerDisconnection = (roomCode: string, playerName: string) => {
  const playerRef = ref(rtdb, `games/${roomCode}/players/${playerName}`);
  onDisconnect(playerRef).remove();
};

export const handleError = (error: Error) => {
  console.error('An error occurred:', error);
  // You could implement more sophisticated error handling here,
  // such as showing an error message to the user or attempting to reconnect
};