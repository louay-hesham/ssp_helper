import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable()
export class CoursesLoaderService {

  constructor(public http:HttpClient) {}

  getCourses() {
    return {
	  	'General': this.http.get("./General.JSON"),
			'CCE': this.http.get("./CCE.JSON"),
		}
  }
}
