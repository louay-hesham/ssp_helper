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
  new_course = {
    'code': subject_info[0].upper(),
    'name': subject_info[1].title(),
    'prerequisites': [] if subject_info[2] == '' else subject_info[2].upper().split('&'),
    'satisfies': [],
    'credit_hours': int(subject_info[3])
  }
  courses[new_course['code']] = new_course
  print(new_course)
  print("\n")

  for prerequisite in new_course['prerequisites']:
    courses[prerequisite]['satisfies'].append(new_course['code'])


with open('Courses.JSON', 'w') as outfile:
  json.dump(courses, outfile)

