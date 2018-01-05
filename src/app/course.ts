export class Course {

  private static allCourses: {[code: string]: Course} = { };

  public static coreCourses: {[code: string]: Course} = { };
  public static electivesGroups: {[level :string] : {[code: string]: Course[]}} = { };
  public static CH: number = 0;
  public static seniorProject1Code: string = '';

  public code: string;
  public name: string;
  public prerequisites: string[];
  public satisfies: string[];
  public creditHours: number;
  public isPassed: boolean;
  public level: string;
  public codeWithName: string;

  private static addData(data: any) {
    for (let key in data) {
      let course = new Course(data[key]);
      Course.allCourses[key] = course;
      if (/[A-Z]+[0-9]+[A-Z]/.test(course.code)) {
        let majorGroup = course.code.slice(0, -1);
        if (!(course.level in Course.electivesGroups)) {
          Course.electivesGroups[course.level] = { }
        }
        if (!(majorGroup in Course.electivesGroups[course.level])) {
          Course.electivesGroups[course.level][majorGroup] = [];
        }

        Course.electivesGroups[course.level][majorGroup].push(course)
      } else {
        Course.coreCourses[key] = course;
      }
    }
  }

  public static loadCourses(coursesData: any, department: string) {
    Course.coreCourses = { };
    Course.CH = 0;
    Course.seniorProject1Code = '';
    Course.electivesGroups = { };

    coursesData['General'].subscribe(data => {
      Course.addData(data);
    });

    coursesData[department].subscribe(data => {
      Course.addData(data);  
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
    if (this.name == 'Senior Project 1') {
      Course.seniorProject1Code = this.code;
    }
  }

  private fail() {
    if (this.isPassed) {
      this.isPassed = false;
      Course.CH -= this.creditHours;
      for (let code of this.satisfies) {
        if (code in Course.allCourses){
          Course.allCourses[code].fail();
        }
      }
    }
  }

  public isAvailable(): boolean {
    let avail = true;
    if (this.code == Course.seniorProject1Code) {
      avail = (Course.CH >= 129)
    }
    for (let i in this.prerequisites) {
      let prerequisite = this.prerequisites[i];
      avail = avail && Course.allCourses[prerequisite].isPassed;
    }
    return avail;
  
  }

  public togglePass() {
    if (this.isPassed) {
      this.fail();
      if (Course.CH < 129) {
        Course.coreCourses[Course.seniorProject1Code].fail();
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
