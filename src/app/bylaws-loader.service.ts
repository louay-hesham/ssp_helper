import { Injectable } from '@angular/core';
import { Bylaw } from './bylaw'

@Injectable({
  providedIn: 'root'
})
export class BylawsLoaderService {

  constructor() {
    this.fetchBylaws()
        .then(data => {
          let bylaws = [];
          for (let i in data) {
            bylaws.push(new Bylaw(data[i]));
          }
          Bylaw.loadBylaws(bylaws);
        })
  }

  private fetchBylaws(): Promise<Bylaw[]> {
    return fetch("https://jc903eqh55.execute-api.eu-west-1.amazonaws.com/SSPHeSspHeZWPXQR9EPGNX/GetBylaws")
        .then(response => {
          return response.json<Bylaw[]>();
        })
        .catch(error =>{
          console.error(error);
        })
  }
}
