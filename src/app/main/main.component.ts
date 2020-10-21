import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

	public levels: string[] = ['1','2','3','4','5','6','7','8','9','10', 'e','h'];
  public bylawsStatus: any[] = [{year: 2019, status: "AVAILABLE"}]; // TODO: Load years from DDB
  public bylawYear: number = 2019
  public departmentCode: string = 'CCE';
  public departmentName: string = 'Computer and Communications Engineering';
  public departmentsNames: string[] = [
    'Gas and Petrochemicals Engineering',
    'Electromechanical Engineering',
    'Architectural and Construction Engineering',
    'Computer and Communications Engineering',
    'Offshore and Coastal Engineering'
  ];

  constructor(private coursesLoader: CoursesLoaderService) { }

  ngOnInit() {
    this.loadBylaw(this.bylawYear);
  }

  loadBylaw(year: number) {
    console.log(year);
    console.log(this.bylawsStatus)
    this.coursesData = this.coursesLoader.getCourses(this.bylawYear);
    Course.loadCourses(this.coursesData, this.departmentCode);
    this.electivesDict();
  }

  getCH(): number {
    return Course.CH;
  }

  selectDepartment(i: number) {
    this.departmentCode = this.departmentsCodes[i];
    this.departmentName = this.departmentsNames[i];
    console.log('Changed department to ' + this.departmentCode);
    Course.loadCourses(this.coursesData, this.departmentCode);
    document.getElementById('depDropdown').classList.toggle('open');
  }

  completeLevelButtonVisibility(level: string): boolean {
  	if (level == 'h' || level == 'e') {
  		return false;
  	} else {
  		return true;
  	}
  }

  completeLevel(level: string) {
  	for (let key in Course.coreCourses) {
  		let course = Course.coreCourses[key];
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
  	for (let key in Course.coreCourses) {
  		let course = Course.coreCourses[key];
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

  electivesDict() {
    let electivesByLevel = { };
    for (let level in Course.electivesGroups) {
      electivesByLevel[level] = [];
      let groups = Course.electivesGroups[level];
      for (let groupCode in groups) {
        let courses = groups[groupCode];
        electivesByLevel[level].push(courses);
      }
    }
    return electivesByLevel;
  }

  buttonClass(course: Course): string {
    var css: string;
  	if (course.isPassed) {
  		css = "btn btn-primary";
  	} else if (course.isAvailable()) {
  		css = "btn btn-warning";
  	} else {
  		css = "btn btn-danger";
  	}
    if (course.level == 'e') {
      css = css + ' elective';
    }
    return css;
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
