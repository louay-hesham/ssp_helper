import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBylawDialogComponent } from './submit-bylaw-dialog.component';

describe('SubmitBylawDialogComponent', () => {
  let component: SubmitBylawDialogComponent;
  let fixture: ComponentFixture<SubmitBylawDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitBylawDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitBylawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
