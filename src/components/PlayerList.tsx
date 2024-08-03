// src/components/PlayerList.tsx
import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import { Player } from '../utils/gameTypes';
import { useGameStyles } from '../styles/gameStyles';

interface Props {
  players: Player[];
  currentTurn: number;
}

export const PlayerList: React.FC<Props> = ({ players, currentTurn }) => {
  const classes = useGameStyles();

  return (
    <Paper className={classes.gameBoard}>
      <Typography variant="h6" gutterBottom>Players</Typography>
      <List>
        {players.map((player, index) => (
          <ListItem key={player.name} selected={index === currentTurn}>
            <ListItemText 
              primary={player.name} 
              secondary={`Cards: ${player.hand.length}`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};