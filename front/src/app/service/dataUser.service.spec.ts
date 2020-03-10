import { TestBed } from '@angular/core/testing';

import { DataUserService } from './dataUser.service';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataUserService = TestBed.get(DataUserService);
    expect(service).toBeTruthy();
  });
});
