import { Component, OnInit } from '@angular/core';

import { GoogleAnalyticsService } from './google-analytics.service';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private cm: any;

	public appVisible: boolean = false;

	constructor(private cookie: CookieService, private ga: GoogleAnalyticsService) { }

	ngOnInit() { }

  showApp() {
		this.appVisible = true;
  }
}
