import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, onSnapshot, docData } from '@angular/fire/firestore';
import { GameInterface } from '../game-interface';
import { GamePublic } from '../../models/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameFirestoreService {
  private firestore: Firestore = inject(Firestore);

  getGamesCollection() {
    return collection(this.firestore, 'games');
  }

  addGame(game: GameInterface): Promise<any> {
    return addDoc(this.getGamesCollection(), game);
  }

  updateGame(gameId: string, data: Partial<GameInterface>): Promise<void> {
    const docRef = doc(this.firestore, 'games', gameId);
    return updateDoc(docRef, data);
  }

  onGamesList(callback: (snapshot: any) => void) {
    return onSnapshot(this.getGamesCollection(), callback);
  }

  onGameSnapshot(gameId: string, callback: (snapshot: any) => void) {
    const docRef = doc(this.firestore, 'games', gameId);
    return onSnapshot(docRef, callback);
  }

  gameDocData$(gameId: string): Observable<any> {
    const docRef = doc(this.firestore, 'games', gameId);
    return docData(docRef, { idField: 'id' });
  }

  async addNewGame(gamePublic: GamePublic): Promise<any> {
    const game: GameInterface = {
      players: gamePublic.players || [],
      stack: gamePublic.stack || [],
      playedCards: gamePublic.playedCard || [],
      currentPlayer: gamePublic.currentPlayer,
    };
    console.log(gamePublic.currentPlayer);
    console.log(game);
    
    
    return this.addGame(game);
  }
}
