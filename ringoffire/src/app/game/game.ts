import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import {
  addDoc,
  collection,
  doc,
  collectionData,
  Firestore,
  onSnapshot,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { GameInterface } from '../game-interface';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
  gameI: GameInterface[] = [];
  item$;
  updatedGame: GameInterface = {
    id: '',
    players: [],
    stack: [],
    playedCards: [],
    currentPlayer: 0,
  };
  fireBaseChangeCount: number = 0;
  stackPushCount: number = 0;
  currentGameId: string = '';
  unsubList;
  unsubSingle;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    console.log(this.firestore);
    this.unsubList = this.setGamesList();

    this.unsubSingle = this.setSingleGame();

    const docRef = doc(this.firestore, 'games', 'B7UpE4AoX46Ago7jxDd5');
    this.item$ = docData(docRef, { idField: 'id' });
    console.log(this.item$);
  }

  async updateGame() {
    if (!this.currentGameId) {
      console.warn('currentGameId ist leer, updateGame wird nicht ausgeführt.');
      return;
    }
    let docRef = this.getSingleGameRef('games', this.currentGameId);
    await updateDoc(docRef, this.getCleanJson()).catch((err) => {
      console.error('Firestore updateDoc error:', err);
    });
    console.log(this.getCleanJson());
    console.log(this.game.currentPlayer);
  }

  getCleanJson() {
    return {
      players: this.game.players,
      stack: this.game.stack,
      playedCards: this.game.playedCard,
      currentPlayer: this.game.currentPlayer || 0,
    };
  }

  ngOnDestroy() {
    this.unsubList();
    if (this.unsubSingle) this.unsubSingle();
  }

  addNewGame() {
    let game: GameInterface = {
      players: this.game.players || [],
      stack: this.game.stack || [],
      playedCards: this.game.playedCard || [],
      currentPlayer: this.game.currentPlayer,
    };

    this.addGame(game);
  }

  async addGame(game: GameInterface) {
    await addDoc(this.getGameRef(), game)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  getGameList() {}

  setGamesList() {
    return onSnapshot(this.getGameRef(), (list) => {
      list.forEach((element) => {
        /* console.log(this.setGameObject(element.data(), element.id)); */
      });
    });
  }

  setSingleGame() {
    if (this.currentGameId) {
      return onSnapshot(
        this.getSingleGameRef('games', this.currentGameId),
        (element) => {
          this.updatedGame = this.setGameObject(element.data(), element.id);
          console.log(this.updatedGame.playedCards);
          this.pushNewStack();
          /* this.fireBaseChanged(); */
        }
      );
    } else {
      return;
    }
  }

  /*   fireBaseChanged() {
    this.fireBaseChangeCount++;
    if (this.fireBaseChangeCount >= 2) {
      this.game.players = this.updatedGame.players;
      this.game.currentPlayer = this.updatedGame.currentPlayer;
    }
  } */

  pushNewStack() {
    this.stackPushCount++;
    if (this.stackPushCount == 1) {
      this.game.stack = [];
      this.game.stack.push(...(this.updatedGame.stack ?? []));
      console.log(this.game.stack);
      console.log(this.updatedGame.stack);

      this.game.players = this.updatedGame.players;
      this.game.currentPlayer = this.updatedGame.currentPlayer;
    }
  }

  setGameObject(obj: any, id: string): GameInterface {
    return {
      id: id || '',
      players: obj.players || [],
      stack: obj.stack || [],
      playedCards: obj.playedCards || [],
      currentPlayer: obj.currentPlayer,
    };
  }

  getSingleGameRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.currentGameId = params['id'];
      this.unsubSingle = this.setSingleGame();
    });
  }

  newGame() {
    this.game = new GamePublic();
    this.updateGame();
  }

  takeCard() {
    this.updateGame();
    if (!this.pickCardAnimation) {
      console.log(this.game.stack);

      console.log(this.currentGameId);
      this.currentCard = this.game.stack.pop() ?? '';
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      console.log(this.game);
      console.log(this.game.currentPlayer);

      console.log(this.game.currentPlayer);
      if (this.game.players.length > 0) {
         this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      }
      this.updateGame();
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayer);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }

      if (name !== undefined) {
      }
    });
  }
}
