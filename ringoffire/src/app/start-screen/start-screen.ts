import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GamePublic } from '../../models/game';
import { GameFirestoreService } from '../services/game-firestore';

@Component({
  selector: 'app-start-screen',
  imports: [],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreen {
  constructor(
    private router: Router,
    private gameFirestore: GameFirestoreService
  ) {}

  newGame() {
    let game = new GamePublic();
    this.gameFirestore.addNewGame(game).then(docRef => {
      console.log('Neues Spiel erstellt mit ID:', docRef.id);
      this.router.navigate(['/game', docRef.id]);
    }).catch(err => {
      console.error('Fehler bei der Erstellung des Spiels:', err);
    });
  }
}
