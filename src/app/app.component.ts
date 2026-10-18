import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  imports: [NavbarComponent, DisclaimerComponent, MainComponent, FooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  appVisible = false;

  showApp() {
    this.appVisible = true;
  }
}
