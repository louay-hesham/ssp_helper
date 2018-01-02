# Run this script to add extra subjects to the JSON file that's going to be deployed with the webapp.
# This script doesn't actually run with the webapp itself at all.

import json
import sys

general = { }
department = { }

def get_courses_info(courses):
  level = 0
  print("""Enter subject info in the following format:
        [Course Code],[Name],[Prerequisites],[Credit hours]
          Example: MP104,Mechanics 2,MP101&MP103,3
        Enter: term=[h | e | 1..10] to specify which level are the following subjects, you can change them anytime.
          h for humanity subjects, e for elective subjects, numbers from 1 to 10 represtents the terms.
          Example: term=h, term=7 ... etc
        Enter "done" to terminate""")

  while(True):
    subject_str = input('> ')
    if subject_str == 'done':
      break
    if subject_str[0:4] == 'term':
      level = subject_str.split('=')[1];
      print("Now entering subjects in level " + level)
    elif level == 0:
      print("Please specify the term first")
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
        if prerequisite in courses:
          courses[prerequisite]['satisfies'].append(new_course['code'])
        else:
          general[prerequisite]['satisfies'].append(new_course['code'])


try:
  with open('General.JSON') as data_file:
    general = json.load(data_file)
    print('Loaded general courses from JSON.')
except (OSError, IOError, ValueError) as e:
  print("General courses file not found, re-enter the info again")
  get_courses_info(general)
  with open('General.JSON', 'w') as outfile:
    json.dump(general, outfile)

n = input("""Choose the department:
  1- Gas and Petrochemicals Engineering
  2- Electromechanical Engineering
  3- Architectural and Construction Engineering
  4- Computer and Communications Engineering
  5- Offshore and Coastal Engineering
  6- General Department

  Enter department number: 
  """)

department_name = {
  '1': 'GPE', 
  '2': 'EME',
  '3': 'CAE',
  '4': 'CCE',
  '5': 'OCE',
  '6': 'General'
}[n]
file_name = department_name + '.JSON'
if n == '6':
  department = general

try:
  with open(file_name) as data_file:
    department = json.load(data_file)
    print('Loaded ' + department_name + ' courses from JSON.')
except (OSError, IOError, ValueError) as e:
  print(department_name + " courses file not found, re-enter the info again")

get_courses_info(department)
with open(file_name, 'w') as outfile:
  json.dump(department, outfile)

with open('General.JSON', 'w') as outfile:
  json.dump(general, outfile)
