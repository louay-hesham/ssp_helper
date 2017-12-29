export class Course {
  public static courses: {[code: string]: Course} = { };

  public code: string;
  public name: string;
  public prerequisites: string[];
  public satisfies: string[];
  public creditHours: number;

  public static loadCourses(data: any) {
    for (let key in data) {
      Course.courses[key] = new Course(data[key]);
    }
    console.log(Course.courses);
  }

  constructor(data: any) {
    this.code = data['code'];
    this.name = data['name'];
    this.prerequisites = data['prerequisites'];
    this.satisfies = data['satisfies'];
    this.creditHours = data['creditHours'];
  }
}
