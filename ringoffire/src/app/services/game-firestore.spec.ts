import { TestBed } from '@angular/core/testing';

import { GameFirestoreService } from './game-firestore';

describe('GameFirestore', () => {
  let service: GameFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
