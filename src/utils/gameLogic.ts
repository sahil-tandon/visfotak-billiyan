// src/utils/gameLogic.ts
import { Card, CardType, GameState, Player, INITIAL_CARD_COUNT } from './gameTypes';

export function createDeck(): Card[] {
  const cardTypes: CardType[] = ['attack', 'skip', 'favor', 'shuffle', 'see-the-future', 'nope', 'cat'];
  const deck: Card[] = [];

  cardTypes.forEach(type => {
    for (let i = 0; i < 4; i++) {
      deck.push({ type, id: `${type}-${i}` });
    }
  });

  // Add exploding kittens and defuse cards
  for (let i = 0; i < 3; i++) {
    deck.push({ type: 'exploding-kitten', id: `exploding-kitten-${i}` });
    deck.push({ type: 'defuse', id: `defuse-${i}` });
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  return [...deck].sort(() => Math.random() - 0.5);
}

export function dealInitialHands(players: Player[], deck: Card[]): { players: Player[], deck: Card[] } {
  const updatedPlayers = players.map(player => ({
    ...player,
    hand: deck.splice(0, INITIAL_CARD_COUNT)
  }));

  return { players: updatedPlayers, deck };
}

export function drawCard(player: Player, deck: Card[]): { player: Player, deck: Card[], exploded: boolean } {
  const [drawnCard, ...remainingDeck] = deck;
  const updatedPlayer = { ...player, hand: [...player.hand, drawnCard] };
  const exploded = drawnCard.type === 'exploding-kitten';

  return { player: updatedPlayer, deck: remainingDeck, exploded };
}

export function playCard(player: Player, cardIndex: number, gameState: GameState): GameState {
  const card = player.hand[cardIndex];
  const updatedPlayer = {
    ...player,
    hand: player.hand.filter((_, index) => index !== cardIndex)
  };
  const updatedPlayers = gameState.players.map(p => p.name === player.name ? updatedPlayer : p);
  const updatedDiscardPile = [...gameState.discardPile, card];

  let updatedGameState = { ...gameState, players: updatedPlayers, discardPile: updatedDiscardPile };

  // Implement card effects
  switch (card.type) {
    case 'attack':
      updatedGameState = handleAttackCard(updatedGameState);
      break;
    case 'skip':
      updatedGameState = handleSkipCard(updatedGameState);
      break;
    // Implement other card effects...
  }

  return updatedGameState;
}

function handleAttackCard(gameState: GameState): GameState {
  const nextPlayerIndex = (gameState.currentTurn + 1) % gameState.players.length;
  return { ...gameState, currentTurn: nextPlayerIndex };
}

function handleSkipCard(gameState: GameState): GameState {
  const nextPlayerIndex = (gameState.currentTurn + 1) % gameState.players.length;
  return { ...gameState, currentTurn: nextPlayerIndex };
}

// Implement other card effect handlers...

export function checkGameOver(gameState: GameState): GameState {
  const remainingPlayers = gameState.players.filter(player => !player.hand.some(card => card.type === 'exploding-kitten'));
  
  if (remainingPlayers.length === 1) {
    return {
      ...gameState,
      gameOver: true,
      winner: remainingPlayers[0].name
    };
  }

  return gameState;
}