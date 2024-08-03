// src/styles/gameStyles.ts
import { makeStyles } from '@material-ui/core/styles';

export const useGameStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: 120,
    height: 168,
    margin: theme.spacing(1),
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gameBoard: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  playerHand: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  playerList: {
    backgroundColor: theme.palette.background.paper,
  },
  waitingRoom: {
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  actionButton: {
    marginTop: theme.spacing(2),
  },
}));