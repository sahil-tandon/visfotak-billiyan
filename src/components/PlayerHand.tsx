// src/components/PlayerHand.tsx
import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { Player, Card } from '../utils/gameTypes';
import { useGameStyles } from '../styles/gameStyles';

// Import card images
import skipImage from '../assets/skip.jpg';
import attackImage from '../assets/attack.jpg';
import seeTheFutureImage from '../assets/see-the-future.jpg';
import shuffleImage from '../assets/shuffle.jpg';
import favorImage from '../assets/favor.jpg';
import defuseImage from '../assets/defuse.jpg';
import explodingKittenImage from '../assets/exploding-kitten.jpg';
import nopeImage from '../assets/nope.jpg';
import cattermelonImage from '../assets/cattermelon.jpg';
import hairyPotatoCatImage from '../assets/hairy-potato-cat.jpg';

const cardImages: { [key: string]: string } = {
  skip: skipImage,
  attack: attackImage,
  'see-the-future': seeTheFutureImage,
  shuffle: shuffleImage,
  favor: favorImage,
  defuse: defuseImage,
  'exploding-kitten': explodingKittenImage,
  nope: nopeImage,
  cattermelon: cattermelonImage,
  'hairy-potato-cat': hairyPotatoCatImage,
};

interface Props {
  player: Player;
  onPlayCard: (cardIndex: number) => void;
  isCurrentTurn: boolean;
}

export const PlayerHand: React.FC<Props> = ({ player, onPlayCard, isCurrentTurn }) => {
  const classes = useGameStyles();

  if (!player.hand || player.hand.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom>Your Hand</Typography>
        <Typography>Your hand is empty. Draw a card on your turn.</Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>Your Hand</Typography>
      <Grid container className={classes.playerHand}>
        {player.hand.map((card: Card, index: number) => (
          <Grid item key={card.id}>
            <Button
              className={classes.card}
              onClick={() => onPlayCard(index)}
              disabled={!isCurrentTurn}
            >
              <img src={cardImages[card.type]} alt={card.type} className={classes.cardImage} />
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};