# Run this script to add extra subjects to the JSON file that's going to be deployed with the webapp.
# This script doesn't actually run with the webapp itself at all.

import json
import sys

class Course(object):
  def __init__(self, obj):
    self.code = obj['code']
    self.name = obj['name']
    self.prerequisites = obj['prerequisites']
    self.satisfies = obj['satisfies']
    self.credit_hours = obj['credit_hours']

  def __str__(self):
    return str(self.to_JSON())

  def to_JSON(self):
    return {
      'code': self.code,
      'name': self.name,
      'prerequisites': self.prerequisites,
      'satisfies': self.satisfies,
      'credit_hours': self.credit_hours,
    }


try:
  with open('Courses.JSON') as data_file:
    dictionary = json.load(data_file)
    courses = { key: Course(value) for key, value in dictionary.items() }
    print('loaded courses from JSON')
except (OSError, IOError) as e:
  MP000 = {
    'code': 'MP000',
    'name': 'Indomie Sha3reya',
    'prerequisites': [],
    'satisfies': [],
    'credit_hours': 0,
  }
  courses = {
    'MP000': Course(MP000)
  }
  with open('Courses.JSON', 'w') as outfile:
    json.dump({ key: value.to_JSON() for key, value in courses.items() }, outfile)

while(True):
  subject_str = input("""Enter subject info in the following format:
      [Course Code],[Name],[Prerequisites],[Credit hours]
      Example: MP204,Modern Physics,MP101&MP107,3
      Enter "null" to terminate
      Course Info: """
    )
  if subject_str == 'null':
    break

  subject_info = subject_str.split(',')
  new_course = Course({
    'code': subject_info[0],
    'name': subject_info[1],
    'prerequisites': subject_info[2].split('&'),
    'satisfies': [],
    'credit_hours': int(subject_info[3])
  })
  courses[new_course.code] = new_course

  for prerequisite in new_course.prerequisites:
    courses[prerequisite].satisfies.append(new_course.code)

  print(courses[subject_info[0]])


with open('Courses.JSON', 'w') as outfile:
  json.dump({ key: value.to_JSON() for key, value in courses.items() }, outfile)

