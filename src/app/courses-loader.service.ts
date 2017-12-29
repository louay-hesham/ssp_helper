import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable()
export class CoursesLoaderService {

  constructor(public http:HttpClient) {}

	getCourses() {
    return this.http.get("./Courses.JSON");
  }

}
