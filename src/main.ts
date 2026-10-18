import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  // The course data lives in static state that is filled in by async HTTP
  // responses, so the app needs Zone.js to know when to re-render.
  providers: [provideZoneChangeDetection(), provideHttpClient()],
}).catch(err => console.error(err));
