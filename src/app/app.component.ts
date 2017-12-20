import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	public appVisible: boolean = false;
  title = 'app';

  showApp() {
  	this.appVisible = true;
  }
}
