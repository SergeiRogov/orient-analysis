from bs4 import BeautifulSoup
import re
import pprint


class Runner:
    def __init__(self, name: str, course: str, place: int, age_group: str, overall_time: str, splits: list):
        self.name = name
        self.course = course
        self.place = place
        self.age_group = age_group
        self.overall_time = overall_time
        self.splits = splits


# Names of courses
courses = ["Blue", "Red", "Yellow"]

# Sequence of control points of every course
all_courses_controls = []

# List of lists of all runners
all_courses_runners = []

# Regular expression for a control point
control_point = re.compile(r'^\d{1,2}\(\d{2,3}\)')

# Read the HTML file
with open('Sia Mathiatis 26 Mar 2023 splits2.html', 'r') as file:
    html_content = file.read()

# Create BeautifulSoup object
soup = BeautifulSoup(html_content, 'html.parser')

# Find the title of event
title = soup.find('title')

# Find the table elements containing the results for all 3 courses
tables = soup.find_all('table')

# Iterating through 3 courses (=tables) and extracting splits
for course_index, table in enumerate(tables[1:]):

    # Control points of a course
    course_controls = []

    # Runners of a course
    course_runners = []

    # Extract table's rows
    rows = table.find_all('tr')

    # Process each row
    for j, row in enumerate(rows):
        print(j)
        # Extract row's cells
        cells = row.find_all('td')

        # Skip row if all cells are empty
        if all(cell.text.strip() == '' for cell in cells):
            continue

        # Process each cell
        for cell in cells:

            # skip cell if it's empty
            if cell.text.strip() == '':
                continue

            if cell.find(string=control_point) or cell.text.strip() == "F":
                course_controls.append(cell.text.strip())
            print(cell)

    all_courses_controls.append(course_controls)
# pprint.pprint(all_courses_controls)
# print(len(all_courses_controls[0]))
# # Extract table rows
# rows = table.find_all('u')
#
# # Initialize an empty list to store the extracted data
# results = []
#
# # Process each row starting from index 2 (excluding header rows)
# for row in rows[2:]:
#     cells = row.find_all('td')
#
#     # Extract specific cell values
#     place = cells[0].find('font').text.strip()
#     start_number = cells[1].find('font').text.strip()
#     name = cells[2].find('font').text.strip()
#     participant_class = cells[3].find('font').text.strip()
#     time = cells[4].find('font').text.strip()
#
#     # Append the extracted data to the results list
#     results.append({
#         'Place': place,
#         'Start Number': start_number,
#         'Name': name,
#         'Class': participant_class,
#         'Time': time
#     })
#
# # Print the extracted results
# for result in results:
#     print(result)
