import { TestBed } from '@angular/core/testing';

import { ActionPerformedService } from './actionPerformed.service';

describe('ActionPerformedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionPerformedService = TestBed.get(ActionPerformedService);
    expect(service).toBeTruthy();
  });
});
