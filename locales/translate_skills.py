from dotenv import load_dotenv
import os
from openai import OpenAI
import json
import logging


def configure_api():
    load_dotenv()

configure_api()
API_KEY = os.getenv('api_key')
client = OpenAI(
    api_key=API_KEY
)

language = "modern_japanese"

input_file = 'locales/af/skills.jsonl'
output_file = f'locales/skills_{language}.jsonl'
prompt = []

# Open the file in write mode
with open(output_file, 'w', encoding='utf-8'):
    pass



class sesh:
    input_tokens = 0
    output_tokens = 0
context = f'You translate work-related skills from swedish to {language}. You receive a Python list of words and send back the list but translated to {language}. Only give the translated list in {language} as an answer. Use "" for your strings.'



def explain(prompt):
    sesh.input_tokens += len(f'Translate this: {prompt} to {language}')
    sesh.input_tokens += len(context)
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": context
            },
            {
                "role": "user",
                "content": f'Translate this: {prompt} to {language}'
            }
        ],
        model="gpt-3.5-turbo",
    )

    return completion.choices[0].message.content


def process_jsonl_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f_in, open(output_file, 'w', encoding='utf-8') as f_out:
        lines = f_in.readlines()
        num_lines = len(lines)
        line_index = 0
        translated_skills_cache = {}  # Dictionary to cache translated skills
        
        while line_index < num_lines:
            prompt.clear()  # Clear the prompt list before processing each group of lines
            
            # Determine the number of lines to process in this iteration
            lines_to_process = min(50, num_lines - line_index)
            
            for _ in range(lines_to_process):
                line = lines[line_index]
                data = json.loads(line.strip())
                skill = data["skill"]
                prompt.append(skill)
                line_index += 1
            
            # Check if the current set of skills has been translated before
            prompt_key = tuple(prompt)  # Convert list to tuple for dictionary key
            if prompt_key in translated_skills_cache:
                translated_skills = translated_skills_cache[prompt_key]
            else:
                translated_skills_str = explain('\n'.join(prompt))
                sesh.output_tokens += len(translated_skills_str)
                print("Response from GPT-3:", translated_skills_str)  # Print the response
                
                try:
                    translated_skills = eval(translated_skills_str)
                    translated_skills_cache[prompt_key] = translated_skills  # Cache translated skills
                except Exception as e:
                    logging.error("Error evaluating response: %s", e)
                    line_index -= lines_to_process  # Move back to retry the same set of lines
                    continue  # Skip writing to output file if translation failed
            
            # Write translated skills to the output file
            for i, translated_skill in enumerate(translated_skills):
                data = json.loads(lines[line_index - lines_to_process + i].strip())
                data["translation"] = translated_skill
                f_out.write(json.dumps(data, ensure_ascii=False) + '\n')

    print(f"Translation to {language} complete!")


process_jsonl_file(input_file, output_file)

print(f"Input tokens: {sesh.input_tokens}")
print(f"Output tokens: {sesh.output_tokens}")

input_cost = (sesh.input_tokens / 1000000) * 0.5
output_cost = (sesh.output_tokens / 1000000) * 1.5


print(f"Estimated cost: ${input_cost + output_cost}")