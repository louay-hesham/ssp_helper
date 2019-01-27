import json
import collections

general = { }
CAE = { }
def get_department(code):
  if code in general:
    return general
  elif code in CAE:
    return CAE
  else:
    return

def sort_dict(d):
  d = collections.OrderedDict(sorted(d.items()))
  for code, course in d.items():
    d[code] = collections.OrderedDict(sorted(course.items()))
  return d;

with open('General.JSON') as data_file:
  general = json.load(data_file)
  print('Loaded general courses from JSON.')
with open('CAE.JSON') as data_file:
  CAE = json.load(data_file)
  print('Loaded CAE courses from JSON.')

print("""Enter correction in the following format:
  [course code]:[courses that are satisified by it]
  Example: mp104:cae201,cae304
  """)
while(True):
  subject_str = input("> ")
  if subject_str == 'done':
    break 
  code = subject_str.split(':')[0].upper()
  satisfies = subject_str.split(':')[1].upper().split(',')

  dep1 = get_department(code)
  for st in satisfies:
    if st not in dep1[code]['satisfies']:
      print("Adding {} to {}'s prerequisites".format(code, st))
      dep1[code]['satisfies'].append(st)
      dep2 = get_department(st)
      dep2[st]['prerequisites'].append(code)

with open('General.JSON', 'w') as outfile:
  json.dump(sort_dict(general), outfile)

with open('CAE.JSON', 'w') as outfile:
  json.dump(sort_dict(CAE), outfile)