import { of } from 'rxjs';
import { Bylaw, BylawStatus } from './bylaw';
import { Course } from './course';

const general = {
  MP1: { code: 'MP1', name: 'Math 1', credit_hours: 3, level: '1', prerequisites: [], satisfies: ['MP2'] },
  SP1: { code: 'SP1', name: 'Senior Project 1', credit_hours: 3, level: '9', prerequisites: [], satisfies: [] },
  MP2: { code: 'MP2', name: 'Math 2', credit_hours: 3, level: '2', prerequisites: ['MP1'], satisfies: [] },
};
const department = {
  CC1: { code: 'CC1', name: 'Intro', credit_hours: 2, level: '3-e1', prerequisites: [], satisfies: [] },
};

describe('Course', () => {
  beforeEach(() => {
    Course.loadCourses({ General: of(general), CCE: of(department) }, 'CCE');
  });

  it('loads core courses and elective groups', () => {
    expect(Object.keys(Course.coreCourses)).toEqual(['MP1', 'SP1', 'MP2']);
    expect(Course.electivesGroups['3']['e1'][0].code).toBe('CC1');
  });

  it('makes a course available once its prerequisites are passed', () => {
    expect(Course.coreCourses['MP2'].isAvailable()).toBe(false);
    Course.coreCourses['MP1'].togglePass();
    expect(Course.coreCourses['MP2'].isAvailable()).toBe(true);
    expect(Course.CH).toBe(3);
  });

  it('failing a course also fails the courses that depend on it', () => {
    Course.coreCourses['MP1'].togglePass();
    Course.coreCourses['MP2'].togglePass();
    expect(Course.CH).toBe(6);
    Course.coreCourses['MP1'].togglePass();
    expect(Course.coreCourses['MP2'].isPassed).toBe(false);
    expect(Course.CH).toBe(0);
  });
});

describe('Bylaw', () => {
  it('maps API items and lists missing years', () => {
    Bylaw.loadBylaws([new Bylaw({ Year: '2019', Status: 'AVAILABLE' }), new Bylaw({ Year: '2023', Status: 'COMING_SOON' })]);
    expect(Bylaw.getAllBylaws().map(b => b.status)).toEqual([BylawStatus.AVAILABLE, BylawStatus.COMING_SOON]);
    expect(Bylaw.getMissingBylawsYears()).not.toContain(2019);
    expect(Bylaw.getMissingBylawsYears()).toContain(2020);
  });
});
