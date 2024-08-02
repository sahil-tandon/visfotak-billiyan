// src/components/PlayerHand.tsx
import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { GameState, Player, Card } from '../utils/gameTypes';
import { playCard, drawCard } from '../utils/gameLogic';

interface Props {
  player: Player;
  gameState: GameState;
  updateGameState: (newState: GameState) => void;
}

export const PlayerHand: React.FC<Props> = ({ player, gameState, updateGameState }) => {
  const isCurrentTurn = gameState.players[gameState.currentTurn].name === player.name;

  const handlePlayCard = (cardIndex: number) => {
    if (!isCurrentTurn) return;
    const newGameState = playCard(player, cardIndex, gameState);
    updateGameState(newGameState);
  };

  const handleDrawCard = () => {
    if (!isCurrentTurn) return;
    const { player: updatedPlayer, deck: updatedDeck, exploded } = drawCard(player, gameState.deck);
    const updatedPlayers = gameState.players.map(p => p.name === player.name ? updatedPlayer : p);
    const updatedGameState = {
      ...gameState,
      players: updatedPlayers,
      deck: updatedDeck,
      currentTurn: (gameState.currentTurn + 1) % gameState.players.length
    };
    updateGameState(updatedGameState);

    if (exploded) {
      alert('You drew an Exploding Kitten! Game Over for you!');
    }
  };

  return (
    <div>
      <Typography variant="h6">Your Hand</Typography>
      <Grid container spacing={1}>
        {player.hand.map((card: Card, index: number) => (
          <Grid item key={card.id}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayCard(index)}
              disabled={!isCurrentTurn}
            >
              {card.type}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDrawCard}
        disabled={!isCurrentTurn}
      >
        Draw Card
      </Button>
    </div>
  );
};