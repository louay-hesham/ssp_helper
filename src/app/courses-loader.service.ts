import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable()
export class CoursesLoaderService {

  constructor(public http:HttpClient) {}

  getCourses() {
    return {
	  	'General': this.http.get("./General.JSON"),
      'GPE': this.http.get("./GPE.JSON"),
			'EME': this.http.get("./EME.JSON"),
			'CAE': this.http.get("./CAE.JSON"),
			'CCE': this.http.get("./CCE.JSON"),
			'OCE': this.http.get("./OCE.JSON")
		}
  }
}
