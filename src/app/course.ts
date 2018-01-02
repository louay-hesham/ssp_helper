export class Course {

  public static courses: {[code: string]: Course} = { };
  public static CH: number = 0;

  public code: string;
  public name: string;
  public prerequisites: string[];
  public satisfies: string[];
  public creditHours: number;
  public isPassed: boolean;
  public level: string;
  public codeWithName: string;

  public static loadCourses(coursesData: any, department: string) {
    Course.courses = { };
    coursesData['General'].subscribe(data => {
      for (let key in data) {
        Course.courses[key] = new Course(data[key]);
      }  
    });
    coursesData[department].subscribe(data => {
      for (let key in data) {
        Course.courses[key] = new Course(data[key]);
      }  
    });
  }

  constructor(data: any) {
    this.code = data['code'];
    this.name = data['name'];
    this.prerequisites = data['prerequisites'];
    this.satisfies = data['satisfies'];
    this.creditHours = data['credit_hours'];
    this.level = data['level'];
    this.isPassed = false;
    this.codeWithName = this.code + ' - ' + this.name;
  }

  private fail() {
    if (this.isPassed) {
      this.isPassed = false;
      Course.CH -= this.creditHours;
      for (let code in this.satisfies) {
        Course.courses[this.satisfies[code]].fail();
      }
    }
  }

  public isAvailable(): boolean {
    if (this.code == "CC591") {
      return Course.CH >= 129
    } else {
      let avail = true;
      for (let i in this.prerequisites) {
        let prerequisite = this.prerequisites[i];
        avail = avail && Course.courses[prerequisite].isPassed;
      }
      return avail;
    }
  }

  public togglePass() {
    if (this.isPassed) {
      this.fail();
      if (Course.CH < 129) {
        Course.courses["CC591"].fail();
      }
    } else {
      this.pass();  
    }  
  }

  public pass() {
    this.isPassed = true;
    Course.CH += this.creditHours;  
  }

  public getLevelFullName() {
    if (this.level == 'h') {
      return 'Humanity Course';
    } else if (this.level == 'e') {
      return 'Elective Course';
    } else {
      return 'Term ' + this.level;
    }
  }
}
