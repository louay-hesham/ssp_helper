import { Directive, Input, HostListener } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';
import { Course } from './course';


@Directive({
  selector: '[click-event]'
})
export class EventClickDirective {

	@Input('navbar-click')
	public navbarClick: string = undefined;

	@Input('footer-click')
	public footerClick: string = undefined;

	@Input('disclaimer-click')
	public disclaimerClick: string = undefined;

	@Input('course-click')
	public courseClick: [string, Course] = undefined;

	@Input('term-click')
	public termClick: string = undefined;

  @Input('bylaw-action')
	public bylawAction: string = undefined;

  @Input('bylaw-data')
  public bylawData: any = undefined

  constructor(private _GAService: GoogleAnalyticsService) { }

  @HostListener('click')
  onClick() {
  	if (this.navbarClick != undefined) {
  		this._GAService.sendButtonClickEvent('navbar-click', 'navbar', this.navbarClick);
  	}
  	if (this.footerClick != undefined) {
  		this._GAService.sendButtonClickEvent('footer-click', 'footer', this.footerClick);
  	}
  	if (this.disclaimerClick != undefined) {
  		this._GAService.sendButtonClickEvent('disclaimer-click', 'disclaimer', this.disclaimerClick);
  	}
  	if (this.courseClick != undefined) {
  		this._GAService.sendButtonClickEvent('course-click', this.courseClick[0], this.courseClick[1].codeWithName);
  	}
  	if (this.termClick != undefined) {
  		this._GAService.sendButtonClickEvent('term-click', 'Term', this.termClick);
  	}
    if (this.bylawAction != undefined && this.bylawData != undefined) {
  		this._GAService.sendButtonClickEvent(this.bylawAction, 'bylaw-action', this.bylawData);
  	}
  }
}
