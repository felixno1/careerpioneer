import random
import jsonlines

class Skill:
    def __init__(self, name, translation, count, field_id):
        self.name = name
        self.translation = translation
        self.count = count
        self.field_id = field_id

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


def load_skills(lang_code):
    skills = []
    with jsonlines.open(f'locales/{lang_code}/skills.jsonl') as reader:
        for line in reader:
            skills.append(Skill(line['skill'], line['translation'], line['count'], line['field_id']))
    return skills