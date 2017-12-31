import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, Response, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { MainComponent } from './main/main.component';

import { CoursesLoaderService } from './courses-loader.service'
import { GoogleAnalyticsService } from './google-analytics.service';

import { PageviewDirective } from './pageview.directive';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    DisclaimerComponent,
    MainComponent,
    PageviewDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [
    CoursesLoaderService,
    GoogleAnalyticsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
