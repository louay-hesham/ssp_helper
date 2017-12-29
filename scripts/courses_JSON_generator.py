# Run this script to add extra subjects to the JSON file that's going to be deployed with the webapp.
# This script doesn't actually run with the webapp itself at all.

import json
import sys

try:
  with open('Courses.JSON') as data_file:
    courses = json.load(data_file)
    print('Loaded courses from JSON.')
except (OSError, IOError, ValueError) as e:
  print("File not found, re enter everything again.")

print(courses)
level = 0
while(True):
  subject_str = input("""Enter subject info in the following format:
      [Course Code],[Name],[Prerequisites],[Credit hours]
        Example: MP204,Modern Physics,MP101&MP107,3
      Enter: term=[h | e | 1..10] to specify which level are the following subjects, you can change them anytime.
        h for humanity subjects, e for elective subjects, numbers from 1 to 10 represtents the terms.
        Example: term=h, term=7 ... etc
      Enter "null" to terminate
      Course Info: """
    )
  if subject_str == 'null':
    break

  if subject_str[0:4] == 'term':
    level = subject_str.split('=')[1];
    print("Now entering subjects in level " + level)
  elif level == 0:
    print("Please specify the level first")
  else:
    subject_info = subject_str.split(',')
    new_course = {
      'code': subject_info[0].upper(),
      'name': subject_info[1].title(),
      'prerequisites': [] if subject_info[2] == '' else subject_info[2].upper().split('&'),
      'satisfies': [],
      'credit_hours': int(subject_info[3]),
      'level': level
    }
    courses[new_course['code']] = new_course
    print(new_course)
    print("\n")

    for prerequisite in new_course['prerequisites']:
      courses[prerequisite]['satisfies'].append(new_course['code'])


with open('Courses.JSON', 'w') as outfile:
  json.dump(courses, outfile)

