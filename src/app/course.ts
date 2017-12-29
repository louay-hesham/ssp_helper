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

  public static loadCourses(data: any) {
    for (let key in data) {
      Course.courses[key] = new Course(data[key]);
    }
  }

  constructor(data: any) {
    this.code = data['code'];
    this.name = data['name'];
    this.prerequisites = data['prerequisites'];
    this.satisfies = data['satisfies'];
    this.creditHours = data['credit_hours'];
    this.level = data['level'];
    this.isPassed = false;
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

  public pass() {
    this.isPassed = true;
    Course.CH += this.creditHours;
  }
}
