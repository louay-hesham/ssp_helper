import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'instructions',
  templateUrl: './instructions.component.html'
})
export class InstructionsComponent { }
