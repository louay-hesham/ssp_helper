import json
import sys
import collections

def sort_dict(d):
  d = collections.OrderedDict(sorted(d.items()))
  for code, course in d.items():
    d[code] = collections.OrderedDict(sorted(course.items()))
  return d;

dicts = [{}, {}, {}, {}, {}]
file_names = ['General.JSON', 'GPE.JSON', 'EME.JSON', 'CAE.JSON', 'CCE.JSON']

for i, file_name in enumerate(file_names):
  with open(file_name) as data_file:
    dicts[i] = json.load(data_file)

for i in range(0,5):
  dicts[i] = sort_dict(dicts[i])

for i, file_name in enumerate(file_names):
  with open(file_name, 'w') as out_file:
    json.dump(dicts[i], out_file)