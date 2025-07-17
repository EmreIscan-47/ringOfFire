import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GamePublic } from '../../models/game';
import { Player } from '../player/player';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogAddPlayer } from '../dialog-add-player/dialog-add-player';
import { MatCardModule } from '@angular/material/card';
import { GameInfo } from '../game-info/game-info';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    Player,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    GameInfo,
  ],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: GamePublic;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new GamePublic();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() ?? '';
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      console.log(this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayer);

    dialogRef.afterClosed().subscribe((name:string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }

      if (name !== undefined) {
      }
    });
  }
}
