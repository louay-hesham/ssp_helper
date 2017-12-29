import { Component, OnInit } from '@angular/core';
import { CoursesLoaderService } from '../courses-loader.service'
import { Course } from '../course'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private coursesLoader: CoursesLoaderService) { }

  ngOnInit() {
  	this.coursesLoader.getCourses().subscribe(data => {
      Course.loadCourses(data);
  	});
  }

  coursesList() {
  	var coursesArray: Course[] = []
  	for (let key in Course.courses) {
  		let course = Course.courses[key];
  		coursesArray.push(course);
  	}
  	return coursesArray;
  }

  buttonClass(course: Course): string {
  	if (course.isPassed) {
  		return "btn btn-primary";
  	} else if (course.isAvailable()) {
  		return "btn btn-warning";
  	} else {
  		return "btn btn-danger";
  	}
  }

  buttonClicked(course: Course) {
  	course.isPassed = true;
  }

  buttonDisability(course: Course): string {
  	if (course.isAvailable()) {
  		return "";
  	} else {
  		return "disabled";
  	}
  }
}
