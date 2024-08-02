// src/utils/gameTypes.ts
export type CardType = 'attack' | 'skip' | 'favor' | 'shuffle' | 'see-the-future' | 'nope' | 'defuse' | 'exploding-kitten' | 'cat';

export interface Card {
  type: CardType;
  id: string;
}

export interface Player {
  name: string;
  hand: Card[];
}

export interface GameState {
  players: Player[];
  currentTurn: number;
  deck: Card[];
  discardPile: Card[];
  gameOver: boolean;
  winner: string | null;
}

export const INITIAL_CARD_COUNT = 7;
export const MAX_PLAYERS = 10;