import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Bylaw } from './bylaw';

@Injectable({ providedIn: 'root' })
export class BylawsLoaderService {

  constructor() {
    this.fetchBylaws().then(data => {
      const bylaws: Bylaw[] = [];
      for (const i in data) {
        bylaws.push(new Bylaw(data[i]));
      }
      Bylaw.loadBylaws(bylaws);
    });
  }

  private fetchBylaws(): Promise<any> {
    return fetch(`${environment.apiBaseUrl}/GetBylaws`)
      .then(response => response.json())
      .catch(error => {
        console.error(error);
        return [];
      });
  }
}
