import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, Response, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SimpleTimer } from 'ng2-simple-timer';
import { DropdownModule } from 'angular-custom-dropdown';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { MainComponent } from './main/main.component';

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
    EventClickDirective
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
    SimpleTimer
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
