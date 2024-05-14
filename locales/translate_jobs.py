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

language = "yiddish"

input_file = 'locales/se/jobs.jsonl'
output_file = f'locales/jobs_{language}.jsonl'
prompt = []

# Open the file in write mode
with open(output_file, 'w', encoding='utf-8'):
    pass



class sesh:
    input_tokens = 0
    output_tokens = 0
context = f'You translate job-titles from swedish to {language}. You receive a Python list of words and send back the list but translated to {language}. Only give the translated list in {language} as an answer. Use "" for your strings.'



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
        translated_jobs_cache = {}  # Dictionary to cache translated jobs
        
        while line_index < num_lines:
            prompt.clear()  # Clear the prompt list before processing each group of lines
            
            # Determine the number of lines to process in this iteration
            lines_to_process = min(50, num_lines - line_index)
            
            for _ in range(lines_to_process):
                line = lines[line_index]
                data = json.loads(line.strip())
                job = data["job"]
                prompt.append(job)
                line_index += 1
            
            # Check if the current set of jobs has been translated before
            prompt_key = tuple(prompt)  # Convert list to tuple for dictionary key
            if prompt_key in translated_jobs_cache:
                translated_jobs = translated_jobs_cache[prompt_key]
            else:
                translated_jobs_str = explain('\n'.join(prompt))
                sesh.output_tokens += len(translated_jobs_str)
                print("Response from GPT-3:", translated_jobs_str)  # Print the response
                
                try:
                    translated_jobs = eval(translated_jobs_str)
                    translated_jobs_cache[prompt_key] = translated_jobs  # Cache translated jobs
                except Exception as e:
                    logging.error("Error evaluating response: %s", e)
                    line_index -= lines_to_process  # Move back to retry the same set of lines
                    continue  # Skip writing to output file if translation failed
            
            # Write translated jobs to the output file
            for i, translated_job in enumerate(translated_jobs):
                data = json.loads(lines[line_index - lines_to_process + i].strip())
                data["translation"] = translated_job
                f_out.write(json.dumps(data, ensure_ascii=False) + '\n')

    print(f"Translation to {language} complete!")


process_jsonl_file(input_file, output_file)


print(f"Input tokens: {sesh.input_tokens}")
print(f"Output tokens: {sesh.output_tokens}")

input_cost = (sesh.input_tokens / 1000000) * 0.5
output_cost = (sesh.output_tokens / 1000000) * 1.5


print(f"Estimated cost: ${input_cost + output_cost}")