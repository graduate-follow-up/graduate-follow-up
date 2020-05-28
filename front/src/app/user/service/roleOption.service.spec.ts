import { TestBed } from '@angular/core/testing';

import { RoleOptionService } from './roleOption.service';

describe('RolesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleOptionService = TestBed.get(RoleOptionService);
    expect(service).toBeTruthy();
  });
});
