// src/components/Game.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { useGameState } from '../hooks/useGameState';
import { PlayerHand } from './PlayerHand';
import { GameBoard } from './GameBoard';
import { PlayerList } from './PlayerList';
import { WaitingRoom } from './WaitingRoom';

interface Props {
  roomCode: string;
  playerName: string;
}

export const Game: React.FC<Props> = ({ roomCode, playerName }) => {
  const { gameState, updateGameState } = useGameState(roomCode, playerName);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    console.log("Current game state:", gameState);
  }, [gameState]);

  useEffect(() => {
    if (gameState && gameState.gameOver) {
      alert(`Game Over! Winner: ${gameState.winner}`);
    }
  }, [gameState]);

  if (!gameState) {
    return <Typography>Loading...</Typography>;
  }

  const currentPlayer = gameState.players.find(p => p.name === playerName);

  if (!currentPlayer) {
    return <Typography>Player not found</Typography>;
  }

  const startGame = () => {
    setGameStarted(true);
    // Initialize the game state for all players
    const updatedGameState = {
      ...gameState,
      deck: gameState.deck || [],
      discardPile: gameState.discardPile || [],
      currentTurn: 0,
    };
    updateGameState(updatedGameState);
  };

  if (!gameStarted) {
    return (
      <WaitingRoom
        players={gameState.players}
        onStartGame={startGame}
        isHost={gameState.players[0].name === playerName}
      />
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Exploding Kittens - Room: {roomCode}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <PlayerList players={gameState.players} currentTurn={gameState.currentTurn} />
        </Grid>
        <Grid item xs={12} md={9}>
          <GameBoard gameState={gameState} />
          <PlayerHand player={currentPlayer} gameState={gameState} updateGameState={updateGameState} />
        </Grid>
      </Grid>
    </Container>
  );
};