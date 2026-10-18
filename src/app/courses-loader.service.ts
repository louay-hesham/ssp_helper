import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoursesData } from './course';

@Injectable({ providedIn: 'root' })
export class CoursesLoaderService {

  constructor(private http: HttpClient) { }

  getCourses(year: number): CoursesData {
    const departments = ['General', 'GPE', 'EME', 'CAE', 'CCE', 'OCE'];
    return Object.fromEntries(
      departments.map(d => [d, this.http.get(`./Bylaws/${year}/${d}.JSON`)])
    );
  }
}
