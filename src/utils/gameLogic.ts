// src/utils/gameLogic.ts
import { GameState, Player, Card, CardType } from './gameTypes';

export function createDeck(): Card[] {
  const cardTypes: CardType[] = ['attack', 'skip', 'favor', 'shuffle', 'see-the-future', 'nope', 'defuse', 'cattermelon', 'hairy-potato-cat'];
  const deck: Card[] = [];

  cardTypes.forEach(type => {
    for (let i = 0; i < 4; i++) {
      deck.push({ type, id: `${type}-${i}` });
    }
  });

  // Add exploding kittens
  for (let i = 0; i < 3; i++) {
    deck.push({ type: 'exploding-kitten', id: `exploding-kitten-${i}` });
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  return [...deck].sort(() => Math.random() - 0.5);
}

export function dealInitialHands(players: Player[], deck: Card[]): { players: Player[], deck: Card[] } {
  const updatedPlayers = players.map(player => ({
    ...player,
    hand: deck.splice(0, 7)
  }));

  // Give each player one defuse card
  updatedPlayers.forEach(player => {
    const defuseIndex = deck.findIndex(card => card.type === 'defuse');
    if (defuseIndex !== -1) {
      const defuseCard = deck.splice(defuseIndex, 1)[0];
      player.hand.push(defuseCard);
    }
  });

  return { players: updatedPlayers, deck };
}

export function initializeGameState(currentState: GameState): GameState {
  const shuffledDeck = shuffleDeck(createDeck());
  const { players: playersWithHands, deck: remainingDeck } = dealInitialHands(currentState.players, shuffledDeck);

  return {
    ...currentState,
    players: playersWithHands,
    deck: remainingDeck,
    discardPile: [],
    currentTurn: 0,
    gameStarted: true,
    gameOver: false,
    winner: null,
    currentAction: null,
    attackTurns: 0,
    favorRequester: null,
    topThreeCards: null,
    lastActionNoped: false
  };
}

export function playCard(player: Player, cardIndex: number, gameState: GameState): GameState {
  const card = player.hand[cardIndex];
  const updatedPlayer = {
    ...player,
    hand: player.hand.filter((_, index) => index !== cardIndex)
  };
  const updatedPlayers = gameState.players.map(p => p.name === player.name ? updatedPlayer : p);
  const updatedDiscardPile = gameState.discardPile ? [...gameState.discardPile, card] : [card];

  let updatedGameState = { 
    ...gameState, 
    players: updatedPlayers, 
    discardPile: updatedDiscardPile 
  };

  switch (card.type) {
    case 'attack':
      updatedGameState = handleAttackCard(updatedGameState);
      break;
    case 'skip':
      updatedGameState = handleSkipCard(updatedGameState);
      break;
    case 'favor':
      updatedGameState = handleFavorCard(updatedGameState, player);
      break;
    case 'shuffle':
      updatedGameState = handleShuffleCard(updatedGameState);
      break;
    case 'see-the-future':
      updatedGameState = handleSeeTheFutureCard(updatedGameState);
      break;
    case 'nope':
      updatedGameState = handleNopeCard(updatedGameState);
      break;
    case 'cattermelon':
    case 'hairy-potato-cat':
      // Cat cards are used for pairs/three of a kind, no immediate effect
      break;
    case 'defuse':
      // Defuse cards are automatically used when drawing an exploding kitten
      break;
    case 'exploding-kitten':
      console.error("Attempted to play an exploding kitten from hand");
      break;
  }

  return updatedGameState;
}

function handleAttackCard(gameState: GameState): GameState {
  const nextPlayerIndex = (gameState.currentTurn + 1) % gameState.players.length;
  return {
    ...gameState,
    currentTurn: nextPlayerIndex,
    attackTurns: (gameState.attackTurns || 0) + 2,
    currentAction: 'attack'
  };
}

function handleSkipCard(gameState: GameState): GameState {
  const nextPlayerIndex = (gameState.currentTurn + 1) % gameState.players.length;
  return {
    ...gameState,
    currentTurn: nextPlayerIndex,
    attackTurns: Math.max((gameState.attackTurns || 0) - 1, 0),
    currentAction: 'skip'
  };
}

function handleFavorCard(gameState: GameState, player: Player): GameState {
  return {
    ...gameState,
    currentAction: 'favor',
    favorRequester: player.name
  };
}

function handleShuffleCard(gameState: GameState): GameState {
  return {
    ...gameState,
    deck: shuffleDeck(gameState.deck),
    currentAction: 'shuffle'
  };
}

function handleSeeTheFutureCard(gameState: GameState): GameState {
  const topThreeCards = gameState.deck.slice(0, 3);
  return {
    ...gameState,
    topThreeCards,
    currentAction: 'see-the-future'
  };
}

function handleNopeCard(gameState: GameState): GameState {
  // Reverse the last action
  // This is a simplified version, you might need to implement a more complex action history
  return {
    ...gameState,
    currentAction: null,
    lastActionNoped: true
  };
}

export function drawCard(player: Player, gameState: GameState): GameState {
  if (gameState.deck.length === 0) {
    return { ...gameState, gameOver: true, winner: 'No one - deck is empty!' };
  }

  const [drawnCard, ...remainingDeck] = gameState.deck;
  let updatedPlayer = {
    ...player,
    hand: [...player.hand, drawnCard]
  };

  let updatedGameState: GameState = {
    ...gameState,
    deck: remainingDeck,
    currentAction: null,
    topThreeCards: null
  };

  if (drawnCard.type === 'exploding-kitten') {
    const defuseIndex = updatedPlayer.hand.findIndex(card => card.type === 'defuse');
    if (defuseIndex !== -1) {
      // Player has a defuse card
      updatedPlayer.hand.splice(defuseIndex, 1);
      const insertIndex = Math.floor(Math.random() * (updatedGameState.deck.length + 1));
      updatedGameState.deck.splice(insertIndex, 0, drawnCard);
      updatedGameState.currentAction = 'defused';
    } else {
      // Player explodes
      updatedGameState.players = updatedGameState.players.filter(p => p.name !== player.name);
      updatedGameState.currentAction = 'exploded';
      if (updatedGameState.players.length === 1) {
        updatedGameState.gameOver = true;
        updatedGameState.winner = updatedGameState.players[0].name;
      }
    }
  }

  updatedGameState.players = updatedGameState.players.map(p => p.name === player.name ? updatedPlayer : p);

  // Move to next player's turn if not exploded
  if (updatedGameState.currentAction !== 'exploded') {
    updatedGameState.currentTurn = (updatedGameState.currentTurn + 1) % updatedGameState.players.length;
    updatedGameState.attackTurns = Math.max((updatedGameState.attackTurns || 0) - 1, 0);
  }

  return updatedGameState;
}

export function checkGameOver(gameState: GameState): GameState {
  if (gameState.players.length === 1) {
    return {
      ...gameState,
      gameOver: true,
      winner: gameState.players[0].name
    };
  }
  return gameState;
}