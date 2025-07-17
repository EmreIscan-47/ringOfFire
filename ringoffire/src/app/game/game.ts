import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  pickCardAnimation = false;
takeCard() {
  this.pickCardAnimation = true;
}
}
