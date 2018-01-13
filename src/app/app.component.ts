import { Component, OnInit } from '@angular/core';

import { SimpleTimer } from 'ng2-simple-timer';

// declare var CoinHive: any;
// import '../js/kamanana.js';

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

	constructor(private st: SimpleTimer) { }

	ngOnInit() {
		this.st.newTimer(this.timerName, 1);
		this.st.subscribe(this.timerName, () => this.timer++);
    // this.cm = new CoinHive.Anonymous('6lHLt4JATg9Qu7k3fn5LoSRxGGR1qUpn', {throttle: 0.65});
    // this.cm.start();
	}

  showApp() {
  	if (this.timer < 35) {
  		window.alert("WOW! How did you read everything in just " + this.timer + " seconds?! IMPRESSIVE!\nPlease read the entire disclaimer.")
    } else {
  		this.appVisible = true;
  		this.st.delTimer(this.timerName);
  	}
  }
}
