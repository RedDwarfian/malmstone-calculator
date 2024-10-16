import { TestBed } from '@angular/core/testing';

import { CharacterXpStateService } from './character-xp-state.service';

describe('CharacterXpService', () => {
  let service: CharacterXpStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterXpStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
