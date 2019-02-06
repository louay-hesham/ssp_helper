import { Component, OnInit } from '@angular/core';

import { SimpleTimer } from 'ng2-simple-timer';
import { CookieService } from 'ngx-cookie-service';

declare var FuckAdBlock: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private timer: number = 0;
	private timerName: string = 'DisclaimerDuration';
  private cm: any;
  private fuckAdBlock: any;

  public adBlockEnabled: boolean = false;
	public appVisible: boolean = false;

	constructor(private st: SimpleTimer, private cookie: CookieService) { }

	ngOnInit() {
		this.st.newTimer(this.timerName, 1);
		this.st.subscribe(this.timerName, () => this.timer++);
    try {
      this.fuckAdBlock = new FuckAdBlock;
      this.fuckAdBlock.onDetected(this.adBlockDetected)
      this.fuckAdBlock.onNotDetected(this.adBlockNotDetected)
      this.fuckAdBlock.check(false);
    } catch (e) {
      this.adBlockDetected()
    }

    // try {
    //   $.getScript("https://authedmine.com/lib/authedmine.min.js",
    //     function() {
    //       var miner = new CoinHive.Anonymous('6lHLt4JATg9Qu7k3fn5LoSRxGGR1qUpn', {throttle: 0.3});
    //       if (!miner.isMobile() && !miner.didOptOut(14400)) {
    //           miner.start();
    //       }
    //     }
    //   );
    // } catch (e) {
    //   this.adsBlocked = false;
    // }
    // alert(this.adsBlocked);
	}

  private adBlockDetected() {
    this.adBlockEnabled = true;
  }

  private adBlockNotDetected() {
    this.adBlockEnabled = false;
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
