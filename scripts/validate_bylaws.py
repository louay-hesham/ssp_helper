#!/usr/bin/env python3
"""Consistency checks for the bylaw course data in scripts/Bylaws/<year>/.

Each year has General.JSON plus one file per department; the app always loads
General together with one department, so every check runs on that merged view.
Run: python3 scripts/validate_bylaws.py    (exit code 1 if anything is wrong)
"""
import collections
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BYLAWS = os.path.join(HERE, "Bylaws")
DEPARTMENTS = ["GPE", "EME", "CAE", "CCE", "OCE"]

LEVEL = re.compile(r"(\d+|h|e)(?:-e(\d+))?")

# (department, course, prerequisite) triples that are listed that way in the
# source PDF even though they break the "earlier term" rule.
SAME_TERM_ALLOWED = {("OCE", "OCE434", "OCE402")}


def term(course):
    match = LEVEL.fullmatch(str(course["level"]))
    return int(match.group(1)) if match and match.group(1).isdigit() else None


def check_department(year, department, general, own):
    problems = []
    where = f"{year}/{department}"
    merged = {**general, **own}

    for key, course in merged.items():
        if course.get("code") != key:
            problems.append(f"{where}: key {key} != code {course.get('code')!r}")
        hours = course.get("credit_hours")
        if not isinstance(hours, int) or isinstance(hours, bool) or hours <= 0:
            problems.append(f"{where}: {key} has credit_hours {hours!r}")
        if not LEVEL.fullmatch(str(course.get("level"))):
            problems.append(f"{where}: {key} has level {course.get('level')!r}")
        name = course.get("name", "")
        if name != name.strip() or "  " in name:
            problems.append(f"{where}: {key} name has stray whitespace: {name!r}")
        if "satisfies" in course:
            problems.append(f"{where}: {key} still has a 'satisfies' field (it is derived from prerequisites)")
        prerequisites = course.get("prerequisites", [])
        if len(set(prerequisites)) != len(prerequisites):
            problems.append(f"{where}: {key} lists a prerequisite twice: {prerequisites}")
        for prerequisite in prerequisites:
            if prerequisite not in merged:
                problems.append(f"{where}: {key} requires {prerequisite}, which does not exist")
            elif (term(course) is not None and term(merged[prerequisite]) is not None
                  and term(merged[prerequisite]) >= term(course)
                  and (department, key, prerequisite) not in SAME_TERM_ALLOWED):
                problems.append(f"{where}: {key} (term {course['level']}) requires {prerequisite} "
                                f"(term {merged[prerequisite]['level']}), which is not an earlier term")

    names = collections.defaultdict(list)
    for key, course in merged.items():
        names[course["name"].strip().lower()].append(key)
    for name, codes in names.items():
        if len(codes) > 1:
            problems.append(f"{where}: {codes} all have the name {name!r}")

    senior = [key for key, course in merged.items() if course["name"] == "Senior Project 1"]
    if len(senior) != 1:
        problems.append(f"{where}: expected exactly one 'Senior Project 1', found {senior}")

    state = {}

    def visit(code, path):
        state[code] = 1
        for prerequisite in merged[code].get("prerequisites", []):
            if prerequisite not in merged:
                continue
            if state.get(prerequisite) == 1:
                problems.append(f"{where}: prerequisite cycle " + " -> ".join(path + [code, prerequisite]))
            elif prerequisite not in state:
                visit(prerequisite, path + [code])
        state[code] = 2

    for code in merged:
        if code not in state:
            visit(code, [])
    return problems


def main():
    problems = []
    years = sorted(d for d in os.listdir(BYLAWS) if os.path.isdir(os.path.join(BYLAWS, d)))
    for year in years:
        def load(name):
            with open(os.path.join(BYLAWS, year, name + ".JSON"), encoding="utf-8") as handle:
                return json.load(handle)
        general = load("General")
        for department in DEPARTMENTS:
            own = load(department)
            for key in set(general) & set(own):
                problems.append(f"{year}/{department}: {key} is defined in both General and the department file")
            problems += check_department(year, department, general, own)
    problems = list(dict.fromkeys(problems))
    for problem in problems:
        print(problem)
    print(f"{len(problems)} problem(s) in {len(years)} bylaw year(s): {', '.join(years)}")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
