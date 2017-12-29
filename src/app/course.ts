export class Course {

  public static courses: {[code: string]: Course} = { };

  public code: string;
  public name: string;
  public prerequisites: string[];
  public satisfies: string[];
  public creditHours: number;
  public isPassed: boolean;

  public static loadCourses(data: any) {
    for (let key in data) {
      this.courses[key] = new Course(data[key]);
    }
  }

  constructor(data: any) {
    this.code = data['code'];
    this.name = data['name'];
    this.prerequisites = data['prerequisites'];
    this.satisfies = data['satisfies'];
    this.creditHours = data['creditHours'];
    this.isPassed = false;
  }

  public isAvailable(): boolean {
    let avail = true;
    for (let i in this.prerequisites) {
      let prerequisite = this.prerequisites[i];
      avail = avail && Course.courses[prerequisite].isPassed;
    }
    return avail;
  }
}
