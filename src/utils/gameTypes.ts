// src/utils/gameTypes.ts
export type CardType = 'skip' | 'attack' | 'favor' | 'shuffle' | 'see-the-future' | 'nope' | 'defuse' | 'exploding-kitten' | 'cattermelon' | 'hairy-potato-cat';

export interface Card {
  type: CardType;
  id: string;
}

export interface Player {
  name: string;
  hand: Card[];
}

// In gameTypes.ts

export interface GameState {
  players: Player[];
  currentTurn: number;
  deck: Card[];
  discardPile: Card[];
  gameOver: boolean;
  winner: string | null;
  currentAction: string | null;
  gameStarted: boolean;
  attackTurns: number;
  favorRequester: string | null;
  topThreeCards: Card[] | null;
  lastActionNoped: boolean;
}
export const INITIAL_CARD_COUNT = 7;
export const MAX_PLAYERS = 5;