import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent { }
