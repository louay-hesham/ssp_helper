import { TestBed, inject } from '@angular/core/testing';

import { CoursesLoaderService } from './courses-loader.service';

describe('CoursesLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesLoaderService]
    });
  });

  it('should be created', inject([CoursesLoaderService], (service: CoursesLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
