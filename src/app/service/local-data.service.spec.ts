import { TestBed } from '@angular/core/testing';

import { LocalDataService } from './local-data.service';

describe('LocalXpDataService', () => {
  let service: LocalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
