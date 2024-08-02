// src/components/WaitingRoom.tsx
import React from 'react';
import { Button, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import { Player } from '../utils/gameTypes';

interface Props {
  players: Player[];
  onStartGame: () => void;
  isHost: boolean;
}

export const WaitingRoom: React.FC<Props> = ({ players, onStartGame, isHost }) => {
  return (
    <div>
      <Typography variant="h5">Waiting Room</Typography>
      <List>
        {players.map((player) => (
          <ListItem key={player.name}>
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
      {isHost && (
        <Button variant="contained" color="primary" onClick={onStartGame} disabled={players.length < 2}>
          Start Game
        </Button>
      )}
      {!isHost && <Typography>Waiting for host to start the game...</Typography>}
    </div>
  );
};