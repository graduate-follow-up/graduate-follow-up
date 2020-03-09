import { TestBed } from '@angular/core/testing';

import { DataOptionService } from './dataOption.service';

describe('DataOptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataOptionService = TestBed.get(DataOptionService);
    expect(service).toBeTruthy();
  });
});
