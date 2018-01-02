import { Component, OnInit } from '@angular/core';
import { CoursesLoaderService } from '../courses-loader.service'
import { Course } from '../course'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private coursesData: any;
  private departmentsCodes: string[] = ['GPE', 'EME', 'CAE', 'CCE', 'OCE'];

	public levels: string[] = ['e','1','2','3','4','5','6','7','8','9','10','h'];
  public department: string = 'CCE';
  public departments: string[] = [ 
    'Gas and Petrochemicals Engineering', 
    'Electromechanical Engineering',
    'Architectural and Construction Engineering',
    'Computer and Communications Engineering',
    'Offshore and Coastal Engineering'
  ];

  constructor(private coursesLoader: CoursesLoaderService) { }

  ngOnInit() {
    this.coursesData = this.coursesLoader.getCourses()
    Course.loadCourses(this.coursesData, this.department);
  }

  getCH(): number {
    return Course.CH;
  }

  selectDepartment(i: number) {
    this.department = this.departmentsCodes[i];
    console.log('Changed department to ' + this.department);
    Course.loadCourses(this.coursesData, this.department);
  }

  completeLevelButtonVisibility(level: string): boolean {
  	if (level == 'h' || level == 'e') {
  		return false;
  	} else {
  		return true;
  	}
  }

  completeLevel(level: string) {
  	for (let key in Course.courses) {
  		let course = Course.courses[key];
  		if (course.level == level && course.isAvailable() && !course.isPassed) {
  			course.pass();
  		}
  	}
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

  buttonDisability(course: Course): string {
  	if (course.isAvailable()) {
  		return "";
  	} else {
  		return "disabled";
  	}
  }

  buttonStyle(avail: boolean): string {
  	if (avail) {
  		return "pointer";
  	} else {
  		return ""
  	}
  }
}
