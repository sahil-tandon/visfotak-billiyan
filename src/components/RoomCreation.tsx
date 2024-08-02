// src/components/RoomCreation.tsx
import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@material-ui/core';

interface Props {
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export const RoomCreation: React.FC<Props> = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode && playerName) {
      onJoinRoom(roomCode, playerName);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Join Exploding Kittens Game
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Join Room
        </Button>
      </form>
    </Container>
  );
};