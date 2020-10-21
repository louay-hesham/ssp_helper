import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CoursesLoaderService {

  constructor(public http:HttpClient) {}

  getCourses(year: number) {
    return {
	  	'General': this.http.get(`./Bylaws/${year}/General.JSON`),
      'GPE': this.http.get(`./Bylaws/${year}/GPE.JSON`),
			'EME': this.http.get(`./Bylaws/${year}/EME.JSON`),
			'CAE': this.http.get(`./Bylaws/${year}/CAE.JSON`),
			'CCE': this.http.get(`./Bylaws/${year}/CCE.JSON`),
			'OCE': this.http.get(`./Bylaws/${year}/OCE.JSON`)
		}
  }
}
