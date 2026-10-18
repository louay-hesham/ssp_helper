import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Bylaw, BylawStatus } from '../bylaw';
import { BylawsLoaderService } from '../bylaws-loader.service';
import { Course, CoursesData } from '../course';
import { CoursesLoaderService } from '../courses-loader.service';
import { InstructionsComponent } from '../instructions/instructions.component';
import { SubmitBylawDialogComponent } from '../submit-bylaw-dialog/submit-bylaw-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-main',
  imports: [InstructionsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  private coursesData!: CoursesData;
  private departmentsCodes: string[] = ['GPE', 'EME', 'CAE', 'CCE', 'OCE'];

  public levels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'e', 'h'];
  public bylawYear = 2019;
  public departmentCode = 'CCE';
  public departmentName = 'Computer and Communications Engineering';
  public departmentsNames: string[] = [
    'Gas and Petrochemicals Engineering',
    'Electromechanical Engineering',
    'Architectural and Construction Engineering',
    'Computer and Communications Engineering',
    'Offshore and Coastal Engineering'
  ];

  constructor(
    private coursesLoader: CoursesLoaderService,
    // Injected for its side effect: it fetches the bylaws list when created.
    private bylawsLoader: BylawsLoaderService,
    public dialog: MatDialog
  ) {
    this.loadBylaw(this.bylawYear);
  }

  selectBylaw(year: string) {
    this.bylawYear = parseInt(year, 10);
    this.loadBylaw(this.bylawYear);
  }

  loadBylaw(year: number) {
    console.log('Loading bylaw ' + year);
    this.coursesData = this.coursesLoader.getCourses(year);
    Course.loadCourses(this.coursesData, this.departmentCode);
  }

  getAllBylaws(): Bylaw[] {
    return Bylaw.getAllBylaws();
  }

  bylawButtonClass(bylaw: Bylaw): string {
    return '' + this.bylawYear === bylaw.year ? 'btn btn-primary' : 'btn btn-danger';
  }

  bylawButtonDisabled(bylaw: Bylaw): boolean {
    return bylaw.status === BylawStatus.COMING_SOON || '' + this.bylawYear === bylaw.year;
  }

  bylawButtonText(bylaw: Bylaw): string {
    let text = '' + bylaw.year;
    if (bylaw.status === BylawStatus.COMING_SOON) {
      text += ' (Coming soon!)';
    }
    return text;
  }

  openBylawSubmitDialog() {
    this.dialog.open(SubmitBylawDialogComponent, { width: '650px' });
  }

  getCH(): number {
    return Course.CH;
  }

  selectDepartment(i: number) {
    this.departmentCode = this.departmentsCodes[i];
    this.departmentName = this.departmentsNames[i];
    console.log('Changed department to ' + this.departmentCode);
    Course.loadCourses(this.coursesData, this.departmentCode);
  }

  completeLevelButtonVisibility(level: string): boolean {
    return level !== 'h' && level !== 'e';
  }

  completeLevel(level: string) {
    for (const key in Course.coreCourses) {
      const course = Course.coreCourses[key];
      if (course.level === level && course.isAvailable() && !course.isPassed) {
        course.pass();
      }
    }
  }

  levelName(level: string): string {
    if (level === 'h') {
      return 'Humanities courses';
    } else if (level === 'e') {
      return 'Elective courses';
    } else {
      return 'Term ' + level;
    }
  }

  coursesList(): Course[] {
    const coursesArray: Course[] = Object.values(Course.coreCourses);
    coursesArray.sort((c1, c2) => {
      if (c1.code.length > c2.code.length) {
        return 1;
      } else if (c1.code.length < c2.code.length) {
        return -1;
      } else if (c1.code > c2.code) {
        return 1;
      } else {
        return -1;
      }
    });
    return coursesArray;
  }

  electivesDict(): { [level: string]: Course[][] } {
    const electivesByLevel: { [level: string]: Course[][] } = {};
    for (const level in Course.electivesGroups) {
      electivesByLevel[level] = Object.values(Course.electivesGroups[level]);
    }
    return electivesByLevel;
  }

  buttonClass(course: Course): string {
    let css: string;
    if (course.isPassed) {
      css = 'btn btn-primary';
    } else if (course.isAvailable()) {
      css = 'btn btn-warning';
    } else {
      css = 'btn btn-danger';
    }
    if (course.level === 'e') {
      css = css + ' elective';
    }
    return css;
  }
}
