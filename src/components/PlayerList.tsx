// src/components/PlayerList.tsx
import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import { Player } from '../utils/gameTypes';

interface Props {
  players: Player[];
  currentTurn: number;
}

export const PlayerList: React.FC<Props> = ({ players, currentTurn }) => {
  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h6">Players</Typography>
      <List>
        {players.map((player, index) => (
          <ListItem key={player.name} selected={index === currentTurn}>
            <ListItemText primary={player.name} secondary={`Cards: ${player.hand.length}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};