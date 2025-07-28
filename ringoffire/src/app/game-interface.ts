export interface GameInterface {
  id?: string;
  players: string[];
  stack?: string[];
  playedCards: string[];
  currentPlayer: number;
}
