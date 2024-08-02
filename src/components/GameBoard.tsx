// src/components/GameBoard.tsx
import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { GameState } from '../utils/gameTypes';

interface Props {
  gameState: GameState;
}

export const GameBoard: React.FC<Props> = ({ gameState }) => {
  return (
    <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
      <Typography variant="h6">Game Board</Typography>
      <Typography>Cards in Deck: {gameState.deck?.length || 0}</Typography>
      <Typography>Discard Pile: {gameState.discardPile?.length || 0} cards</Typography>
      <Typography>Current Turn: {gameState.players[gameState.currentTurn]?.name || 'Unknown'}</Typography>
    </Paper>
  );
};