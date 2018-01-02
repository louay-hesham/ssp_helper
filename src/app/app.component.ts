import { Component, OnInit } from '@angular/core';

import { SimpleTimer } from 'ng2-simple-timer';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private timer: number = 0;
	private timerName: string = 'DisclaimerDuration';

	public appVisible: boolean = false;

	constructor(private st: SimpleTimer) { }

	ngOnInit() {
		this.st.newTimer(this.timerName, 1);
		this.st.subscribe(this.timerName, () => this.timer++);
	}

  showApp() {
  	if (this.timer < 25) {
  		window.alert("WOW! How did you read everything in just " + this.timer + " seconds?! IMPRESSIVE!\nPlease read the disclaimer.")
    } else {
  		this.appVisible = true;
  		this.st.delTimer(this.timerName);
  	}
  }
}
