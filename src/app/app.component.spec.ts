import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('shows the disclaimer first and the app after agreeing', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('IMPORTANT DISCLAIMER');
    expect(el.querySelector('app-main')).toBeNull();

    el.querySelector<HTMLButtonElement>('button.btn-outline-danger')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('app-main')).not.toBeNull();
    expect(el.textContent).toContain('Select Bylaw year');
  });
});
