import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

	private static gtag: any;

  constructor() {
  	if (!GoogleAnalyticsService.gtag || GoogleAnalyticsService.gtag == undefined || GoogleAnalyticsService.gtag == null) {
  		window['dataLayer'] = window['dataLayer'] || [];
	  	GoogleAnalyticsService.gtag = function() { window['dataLayer'].push(arguments); }
		  GoogleAnalyticsService.gtag('js', new Date());
		  GoogleAnalyticsService.gtag('config', 'UA-111559411-2', { 'send_page_view': false })
  	}
  }

  sendPageView(pageName: string) {
  	GoogleAnalyticsService.gtag('event', 'page_view', {
      'page_title': pageName,
      'page_location': 'http://louay-morsi.me',
      'page_path': pageName
    });
  }

  sendButtonClickEvent(eventName: string, eventCategory: string, eventLabel: string) {
    GoogleAnalyticsService.gtag('event', eventName, {
      'event_category': eventCategory,
      'event_label': eventLabel
    });
  }

	sendAdsBlockedEvent() {
    GoogleAnalyticsService.gtag('event', 'ads-blocked', {
      'event_category': 'ads',
      'event_label': 'ads-blocked'
    });
  }

	sendAdsEnabledEvent() {
    GoogleAnalyticsService.gtag('event', 'ads-enabled', {
      'event_category': 'ads',
      'event_label': 'ads-enabled'
    });
	}

	sendMinerEvent(minerStatus: string) {
		GoogleAnalyticsService.gtag('event', 'miner-' + minerStatus, {
      'event_category': 'miner',
      'event_label': 'miner-' + minerStatus
    });
	}

}
