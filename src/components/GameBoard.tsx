// src/components/GameBoard.tsx
import React from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import { GameState, Card } from '../utils/gameTypes';
import { useGameStyles } from '../styles/gameStyles';

interface Props {
  gameState: GameState;
  currentPlayerName: string;
}

export const GameBoard: React.FC<Props> = ({ gameState, currentPlayerName }) => {
  const classes = useGameStyles();
  const isCurrentPlayersTurn = gameState.players[gameState.currentTurn].name === currentPlayerName;

  const renderCard = (card: Card) => (
    <Paper className={classes.card}>
      {card.type}
    </Paper>
  );

  return (
    <Paper className={classes.gameBoard}>
      <Typography variant="h6" gutterBottom>Game Board</Typography>
      <Typography>Cards in Deck: {gameState.deck?.length || 0}</Typography>
      <Typography>Discard Pile: {gameState.discardPile?.length || 0} cards</Typography>
      <Typography>Current Turn: {gameState.players[gameState.currentTurn]?.name || 'Unknown'}</Typography>
      {gameState.currentAction === 'see-the-future' && isCurrentPlayersTurn && (
        <div>
          <Typography variant="subtitle1" gutterBottom>Top 3 cards:</Typography>
          <Grid container spacing={1}>
            {gameState.topThreeCards?.map((card, index) => (
              <Grid item key={index} xs={4}>
                {renderCard(card)}
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Paper>
  );
};