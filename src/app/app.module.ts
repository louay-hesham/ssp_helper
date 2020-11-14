import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, Response, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SimpleTimer } from 'ng2-simple-timer';
import { DropdownModule } from 'angular-custom-dropdown';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { MainComponent } from './main/main.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { SubmitBylawDialogComponent } from './submit-bylaw-dialog/submit-bylaw-dialog.component';

import { CoursesLoaderService } from './courses-loader.service'
import { GoogleAnalyticsService } from './google-analytics.service';

import { PageviewDirective } from './pageview.directive';
import { EventClickDirective } from './event-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    DisclaimerComponent,
    MainComponent,
    PageviewDirective,
    NavbarComponent,
    EventClickDirective,
    InstructionsComponent,
    SubmitBylawDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    DropdownModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgbModule.forRoot()
  ],
  providers: [
    CoursesLoaderService,
    GoogleAnalyticsService,
    SimpleTimer,
    CookieService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  entryComponents: [SubmitBylawDialogComponent]
})
export class AppModule { }
