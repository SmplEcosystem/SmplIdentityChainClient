import { TestBed } from '@angular/core/testing';

import { SmplIdentityClientService } from './smpl-identity-client.service';

describe('SmplIdentityClientService', () => {
  let service: SmplIdentityClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmplIdentityClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
