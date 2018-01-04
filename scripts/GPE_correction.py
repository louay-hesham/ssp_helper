import json
import sys

department = { }
with open("GPE.JSON") as data_file:
	department = json.load(data_file)

for key, value in department.items():
	if 'GPE312' in value['prerequisites'] and 'GPE311' not in value['prerequisites']:
		value['prerequisites'].append('GPE311')
		department['GPE311']['satisfies'].append(key)
		print(value)
		print(department['GPE311'])

with open("GPE.JSON",'w') as outfile:
	json.dump(department, outfile)