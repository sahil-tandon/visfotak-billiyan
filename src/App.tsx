// src/App.tsx
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { RoomCreation } from './components/RoomCreation';
import { Game } from './components/Game';
import { handleError } from './utils/errorHandling';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary 
        fallback={<div>An error occurred. Please refresh the page.</div>} 
        onError={(error, errorInfo) => handleError(error)}
      >
        {!roomCode ? (
          <RoomCreation onJoinRoom={(code, name) => {
            setRoomCode(code);
            setPlayerName(name);
          }} />
        ) : (
          <Game roomCode={roomCode} playerName={playerName} />
        )}
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;