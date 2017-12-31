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
	public courseClick: Course = undefined;

	@Input('term-click')
	public termClick: string = undefined;

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
  		this._GAService.sendButtonClickEvent('course-click', this.courseClick.getLevelFullName(), this.courseClick.codeWithName);
  	}
  	if (this.termClick != undefined) {
  		this._GAService.sendButtonClickEvent('term-click', 'all term select', this.termClick);
  	}
  }
}
