import { Directive, Input, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';

@Directive({
  selector: '[pageview]'
})
export class PageviewDirective implements OnInit{

	@Input("pageview")
	public pageName: string;

  constructor(private _GAService: GoogleAnalyticsService) { }

  ngOnInit() {
  	this._GAService.sendPageView(this.pageName);
  }
}
