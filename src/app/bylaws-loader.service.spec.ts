import { TestBed } from '@angular/core/testing';

import { BylawsLoaderService } from './bylaws-loader.service';

describe('BylawsLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BylawsLoaderService = TestBed.get(BylawsLoaderService);
    expect(service).toBeTruthy();
  });
});
