import { Directive, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Directive({
  selector: '[ads-enabled]'
})
export class AdsEnabledDirective {

  constructor(private _GAService: GoogleAnalyticsService) { }

  ngOnInit() {
  	this._GAService.sendAdsEnabledEvent();
  }

}
