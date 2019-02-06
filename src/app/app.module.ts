import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, Response, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SimpleTimer } from 'ng2-simple-timer';
import { DropdownModule } from 'angular-custom-dropdown';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { MainComponent } from './main/main.component';

import { CoursesLoaderService } from './courses-loader.service'
import { GoogleAnalyticsService } from './google-analytics.service';

import { PageviewDirective } from './pageview.directive';
import { EventClickDirective } from './event-click.directive';
import { InstructionsComponent } from './instructions/instructions.component';
import { AdsBlockedDirective } from './ads-blocked.directive';
import { AdsEnabledDirective } from './ads-enabled.directive';

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
    AdsBlockedDirective,
    AdsEnabledDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    DropdownModule
  ],
  providers: [
    CoursesLoaderService,
    GoogleAnalyticsService,
    SimpleTimer,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
