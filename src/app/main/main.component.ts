import { Component, OnInit } from '@angular/core';
import { CoursesLoaderService } from '../courses-loader.service'
import { Course } from '../course'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

	public levels: string[] = ['e','1','2','3','4','5','6','7','8','9','10','h'];

  constructor(private coursesLoader: CoursesLoaderService) { }

  ngOnInit() {
  	this.coursesLoader.getCourses().subscribe(data => {
      Course.loadCourses(data);
  	});
  }

  levelName(level: string): string {
  	if (level == 'h') {
  		return "Humanities courses";
  	} else if (level == 'e') {
  		return "Elective courses";
  	} else {
  		return "Term " + level;
  	}
  }

  coursesList() {
  	var coursesArray: Course[] = []
  	for (let key in Course.courses) {
  		let course = Course.courses[key];
  		coursesArray.push(course);
  	}
  	coursesArray.sort((c1:Course,c2:Course) => {
      if(c1.code.length > c2.code.length) {
        return 1;
      } else if (c1.code.length < c2.code.length){
        return -1;
      } else if (c1.code > c2.code) {
      	return 1;
      } else {
      	return -1;
      }
    });
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
