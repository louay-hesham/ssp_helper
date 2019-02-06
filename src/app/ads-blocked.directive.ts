import { Directive, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Directive({
  selector: '[ads-Blocked]'
})
export class AdsBlockedDirective {

  constructor(private _GAService: GoogleAnalyticsService) { }

  ngOnInit() {
  	this._GAService.sendAdsBlockedEvent();
  }
}
