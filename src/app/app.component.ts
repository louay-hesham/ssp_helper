import { Component, OnInit } from '@angular/core';

import { SimpleTimer } from 'ng2-simple-timer';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private timer: number = 0;
	private timerName: string = 'DisclaimerDuration';
  private cm: any;

	public appVisible: boolean = false;

	constructor(private st: SimpleTimer, private cookie: CookieService) { }

	ngOnInit() {
		this.st.newTimer(this.timerName, 1);
		this.st.subscribe(this.timerName, () => this.timer++);
	}

  showApp() {
  	if (this.timer < 20 && !this.cookie.check('disclaimerPassed')) {
  		window.alert("WOW! How did you read everything in just " + this.timer + " seconds?! IMPRESSIVE!\nPlease read the entire disclaimer.")
    } else {
  		this.appVisible = true;
  		this.st.delTimer(this.timerName);
      this.cookie.set('disclaimerPassed', 'true');
  	}
  }
}
