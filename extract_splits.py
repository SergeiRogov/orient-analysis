from bs4 import BeautifulSoup
import re
import pprint


class Runner:
    def __init__(self, name: str, course: str, place: int, bib: int, age_group: str, overall_time: str, splits: list):
        self.name = name
        self.course = course
        self.place = place
        self.bib = bib
        self.age_group = age_group
        self.overall_time = overall_time
        self.splits = splits

    def __repr__(self):
        return f"\n{self.__class__.__name__}({self.place}, {self.name}, {self.age_group} " \
               f"{self.overall_time} {self.bib} {self.course} {self.splits})"


# Sequence of control points of every course
all_courses_controls = []

# List of lists of all runners
all_courses_runners = []

# Regular expression for a control point "3(57)"
control_point = re.compile(r'^\d{1,2}\(\d{2,3}\)')

# Regular expression for a course title "Blue (16)"
course_title = re.compile(r'\w+\s*\(\d{2,3}\)\s*')

# Read the HTML file
with open('Sia Mathiatis 26 Mar 2023 splits2.html', 'r') as file:
    html_content = file.read()

# Create BeautifulSoup object
soup = BeautifulSoup(html_content, 'html.parser')

# Iterate over each line of the document and delete empty tags
for x in soup.find_all():
    if len(x.get_text(strip=True)) == 0 and x.name not in ['font'] and len(x.find_all()) == 0:
        x.extract()

# Find the title of event
title = soup.find('title')

# Names of courses
courses = soup.find_all('b', string=course_title)
courses = map(lambda title: title.text.strip(),  courses)
courses = list(map(lambda title: re.sub(r"\s*\(\d+\)", '', title),  courses))

# Find the table elements containing the results for all 3 courses (and header coming first)
tables = soup.find_all('table')

# Iterating through 3 courses (=tables) and extracting splits
for course_index, table in enumerate(tables[1:]):

    # Control points of a course
    course_controls = []

    # Runners of a course
    course_runners = []

    place_num = 0
    bib = 0
    name = ''
    group = ''
    time = ''
    info_row = None
    num_of_control_rows = None

    # Extract table's rows
    rows = table.find_all('tr')

    # Process each row
    for row_index, row in enumerate(rows):
        # Skip redundant row (with separated splits)
        if info_row and num_of_control_rows and \
                (info_row & 1) != (row_index & 1) and row_index - info_row < num_of_control_rows * 2 - 1:
            continue
        print(row_index)

        is_runner_found = False
        runner_info_start_index = None

        # Extract row's cells
        cells = row.find_all('td')

        # Skip row if all cells are empty
        if all(cell.text.strip() == '' for cell in cells):
            continue

        # Process each cell
        for cell_index, cell in enumerate(cells):
            print(cell)

            # Extracting course controls' sequence
            if cell.find(string=control_point) or cell.text.strip() == "F":
                course_controls.append(cell.text.strip())
                if cell.text.strip() == "F":
                    # Number of rows covering a course
                    # if it's a single row course (row_index = 0) - it still would be a 2 row course in splits
                    num_of_control_rows = row_index + 1 if row_index > 0 else 2

            # Finding first field related to runner (first <font> tag)
            elif not is_runner_found and cell.find('font'):
                is_runner_found = True
                runner_info_start_index = cell_index
                info_row = row_index
                runner_splits = []
                # Recording info from this field
                place_num = cell.text.strip()

            # Recording runners' info from the 4 following fields
            # Recording splits from the same row
            elif is_runner_found and runner_info_start_index is not None:
                if cell_index == runner_info_start_index + 1:
                    bib = cell.text.strip() if cell.text.strip() != '' else "<--->"
                elif cell_index == runner_info_start_index + 2:
                    name = cell.text.strip() if cell.text.strip() != '' else "<--->"
                elif cell_index == runner_info_start_index + 3:
                    group = cell.text.strip() if cell.text.strip() != '' else "<--->"
                elif cell_index == runner_info_start_index + 4:
                    time = cell.text.strip() if cell.text.strip() != '' else "<--->"
                # splits
                elif len(runner_splits) < len(course_controls):
                    runner_splits.append(cell.text.strip())

                    # if splits end on the same row they start - add a runner
                    if len(runner_splits) == len(course_controls):
                        # Adding runner info
                        course_runners.append(
                            Runner(name, courses[course_index], place_num, bib, group, time, runner_splits))

            # Adding splits from other rows with same parity
            elif (info_row & 1) == (row_index & 1) and info_row != row_index:
                runner_splits.append(cell.text.strip())
                if len(runner_splits) == len(course_controls):
                    # Adding runner info
                    course_runners.append(
                        Runner(name, courses[course_index], place_num, bib, group, time, runner_splits))

    all_courses_controls.append(course_controls)
    all_courses_runners.append(course_runners)

for i in range(len(all_courses_runners)):
    for j in range(len(all_courses_runners[i])):
        print(repr(all_courses_runners[i][j]))

# pprint.pprint(all_courses_controls)
# print(len(all_courses_controls[0]))
