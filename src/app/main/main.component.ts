import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CoursesLoaderService } from '../courses-loader.service'
import { BylawsLoaderService } from '../bylaws-loader.service'
import { Course } from '../course'
import { Bylaw, BylawStatus } from '../bylaw'
import { SubmitBylawDialogComponent } from '../submit-bylaw-dialog/submit-bylaw-dialog.component'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private coursesData: any;
  private departmentsCodes: string[] = ['GPE', 'EME', 'CAE', 'CCE', 'OCE'];

	public levels: string[] = ['1','2','3','4','5','6','7','8','9','10', 'e','h'];
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

  constructor(private coursesLoader: CoursesLoaderService, private bylawsLoader: BylawsLoaderService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadBylaw(this.bylawYear);
  }

  selectBylaw(year: number) {
    this.bylawYear = year;
    this.loadBylaw(year);
  }

  loadBylaw(year: number) {
    console.log("Loading bylaw " + year)
    this.coursesData = this.coursesLoader.getCourses(this.bylawYear);
    Course.loadCourses(this.coursesData, this.departmentCode);
    this.electivesDict();
  }

  getAllBylaws(): Bylaw[] {
    return Bylaw.getAllBylaws();
  }

  bylawButtonClass(bylaw: Bylaw): string {
    var css: string;
  	if (""+this.bylawYear == bylaw.year) {
  		css = "btn btn-primary";
  	} else {
  		css = "btn btn-danger";
  	}
    return css;
  }

  bylawButtonDisability(bylaw: Bylaw): string {
  	if (bylaw.status == BylawStatus.COMING_SOON || ""+this.bylawYear == bylaw.year) {
  		return "disabled";
  	} else {
  		return ""
  	}
  }

  bylawButtonText(bylaw: Bylaw): string {
    let text = ""+bylaw.year
  	if (bylaw.status == BylawStatus.COMING_SOON) {
  		text += " (Coming soon!)"
  	}
    return text
  }

  openBylawSubmitDialog() {
    const dialogRef = this.dialog.open(SubmitBylawDialogComponent, {
      width: '500px'
    });
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
