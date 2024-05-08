import csv
import random

class Skill:
    """Represents a skill with its name, count, and top ID."""
    def __init__(self, name, count, top_id):
        self.name = name
        self.count = count
        self.top_id = top_id


def weighted_shuffle(input_list):
    # Create a copy of the input list
    list_copy = input_list.copy()

    total_weight = sum(item.count for item in list_copy)
    probabilities = [item.count / total_weight for item in list_copy]

    shuffled_list = []
    while list_copy:
        item = random.choices(list_copy, probabilities)[0]
        shuffled_list.append(item)
        list_copy.remove(item)
        total_weight -= item.count
        if total_weight > 0:
            probabilities = [item.count / total_weight for item in list_copy]
        else:
            probabilities = [0] * len(list_copy)

    return shuffled_list

# Load skills from CSV
skills = []
with open('assets/unique_skills_refined.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        skills.append(Skill(row['skill_name'], int(row['count']), row['most_common_occupation_id']))
