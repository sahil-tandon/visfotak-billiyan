// src/components/WaitingRoom.tsx
import React from 'react';
import { Button, Typography, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { Player } from '../utils/gameTypes';
import { useGameStyles } from '../styles/gameStyles';

interface Props {
  players: Player[];
  onStartGame: () => void;
  isHost: boolean;
}

export const WaitingRoom: React.FC<Props> = ({ players, onStartGame, isHost }) => {
  const classes = useGameStyles();

  return (
    <Paper className={classes.gameBoard}>
      <Typography variant="h5" gutterBottom>Waiting Room</Typography>
      <List>
        {players.map((player) => (
          <ListItem key={player.name}>
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
      {isHost && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onStartGame} 
          disabled={players.length < 2}
          className={classes.actionButton}
        >
          Start Game
        </Button>
      )}
      {!isHost && <Typography>Waiting for host to start the game...</Typography>}
    </Paper>
  );
};