// src/components/Game.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, CircularProgress } from '@material-ui/core';
import { useGameState } from '../hooks/useGameState';
import { PlayerHand } from './PlayerHand';
import { GameBoard } from './GameBoard';
import { PlayerList } from './PlayerList';
import { WaitingRoom } from './WaitingRoom';
import { playCard, drawCard, checkGameOver, initializeGameState } from '../utils/gameLogic';
import { GameState, Player } from '../utils/gameTypes';
import { useGameStyles } from '../styles/gameStyles';

interface Props {
  roomCode: string;
  playerName: string;
}

export const Game: React.FC<Props> = ({ roomCode, playerName }) => {
  const classes = useGameStyles();
  const { gameState, updateGameState, joinGame, error } = useGameState(roomCode, playerName);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    console.log("Game component rendered. GameState:", gameState);
    if (gameState && !hasJoined) {
      console.log("Attempting to join game");
      joinGame();
      setHasJoined(true);
    }
  }, [gameState, joinGame, hasJoined]);

  useEffect(() => {
    if (gameState && gameState.gameOver) {
      alert(`Game Over! Winner: ${gameState.winner}`);
    }
  }, [gameState]);

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!gameState) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading... (Room: {roomCode}, Player: {playerName})</Typography>
      </Container>
    );
  }

  const currentPlayer = gameState.players.find(p => p.name === playerName);

  console.log("Current game state:", gameState);
  console.log("Current player:", currentPlayer);

  if (!currentPlayer) {
    return <Typography>Waiting to join the game... (Room: {roomCode}, Player: {playerName})</Typography>;
  }

  const isCurrentTurn = gameState.players[gameState.currentTurn]?.name === playerName;
  const isHost = gameState.players[0]?.name === playerName;

  console.log("Is host:", isHost);
  console.log("Is current turn:", isCurrentTurn);

  const startGame = () => {
    console.log("Start game button clicked");
    if (isHost) {
      const initialGameState = initializeGameState(gameState);
      updateGameState(initialGameState);
    }
  };

  const handlePlayCard = (cardIndex: number) => {
    if (!isCurrentTurn) return;
    const newGameState = playCard(currentPlayer, cardIndex, gameState);
    updateGameState(checkGameOver(newGameState));
  };

  const handleDrawCard = () => {
    if (!isCurrentTurn) return;
    const newGameState = drawCard(currentPlayer, gameState);
    updateGameState(checkGameOver(newGameState));
  };

  const handleFavorRequest = (targetPlayerName: string, cardIndex: number) => {
    if (gameState.currentAction !== 'favor' || gameState.favorRequester !== playerName) return;
    const targetPlayer = gameState.players.find(p => p.name === targetPlayerName);
    if (!targetPlayer) return;

    const card = targetPlayer.hand[cardIndex];
    const updatedTargetPlayer = {
      ...targetPlayer,
      hand: targetPlayer.hand.filter((_, index) => index !== cardIndex)
    };
    const updatedCurrentPlayer = {
      ...currentPlayer,
      hand: [...currentPlayer.hand, card]
    };

    const updatedPlayers = gameState.players.map(p => 
      p.name === targetPlayerName ? updatedTargetPlayer :
      p.name === playerName ? updatedCurrentPlayer : p
    );

    const newGameState = {
      ...gameState,
      players: updatedPlayers,
      currentAction: null,
      favorRequester: null
    };

    updateGameState(newGameState);
  };

  if (!gameState.gameStarted) {
    console.log("Rendering waiting room");
    return (
      <WaitingRoom
        players={gameState.players}
        onStartGame={startGame}
        isHost={isHost}
      />
    );
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exploding Kittens - Room: {roomCode}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <PlayerList players={gameState.players} currentTurn={gameState.currentTurn} />
        </Grid>
        <Grid item xs={12} md={9}>
          <div className={classes.gameBoard}>
            <GameBoard gameState={gameState} currentPlayerName={playerName} />
            <PlayerHand player={currentPlayer} onPlayCard={handlePlayCard} isCurrentTurn={isCurrentTurn} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleDrawCard}
              disabled={!isCurrentTurn}
              className={classes.actionButton}
            >
              Draw Card
            </Button>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};