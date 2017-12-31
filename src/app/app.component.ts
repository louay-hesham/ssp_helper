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
		this.st.newTimer(this.timerName, 0.75);
		this.st.subscribe(this.timerName, () => this.timer++);
	}

  showApp() {
  	if (this.timer < 45) {
  		window.alert("Are you sure you have read the entire disclaimer? It usually takes 45 seconds but you made it in A VERY IMPRESSIVE " + this.timer + " SECONDS");
  	} else {
  		this.appVisible = true;
  		this.st.delTimer(this.timerName);
  	}
  }
}
