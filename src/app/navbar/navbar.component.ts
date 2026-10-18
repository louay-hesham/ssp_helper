import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent { }
