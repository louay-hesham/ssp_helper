import { Component, OnInit } from '@angular/core';
import { CoursesLoaderService } from '../courses-loader.service'
import { Course } from '../course'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

	private courses: any;

  constructor(private coursesLoader: CoursesLoaderService) { }

  ngOnInit() {
  	this.coursesLoader.getCourses().subscribe(data => {
      Course.loadCourses(data);
  	});
  }
}
