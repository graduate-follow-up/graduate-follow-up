import { TestBed } from '@angular/core/testing';

import { AlumnusService } from './alumnus.service';

describe('AlumnusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlumnusService = TestBed.get(AlumnusService);
    expect(service).toBeTruthy();
  });
});
