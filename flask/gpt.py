from dotenv import load_dotenv
import os
from openai import OpenAI

def configure_api():
    load_dotenv()

configure_api()
API_KEY = os.getenv('api_key')
client = OpenAI(
    # This is the default and can be omitted
    api_key=API_KEY
)

def estimate_tokens(text):
    return len(text.split())

context_persona = "Serve as a career counselor expert in Swedish employment laws and job market terms. Assist a migrant seeking employment in Sweden. Respond in the user's language, concisely and clearly."

context_surroundings = "You are on a webpage with four sections: Common terminology, Legal & regulations, Chat, and a job recommendation tool. Guide users unfamiliar with Swedish job market topics to appropriatoe sections."

context_elaborate = "Provide new advice on each topic and avoid repeating previously given information."

def chat(prompt, chat_logs):
    if len(chat_logs) >= 3:
                completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f'{context_persona}'
                },
                {
                    "role": "system",
                    "content": f'{context_surroundings}'
                },
                {
                    "role": "user",
                    "content": f"{chat_logs[-3]['user']}"
                },
                {
                    "role": "assistant",
                    "content": f"{chat_logs[-2]['gpt']}"
                },
                {
                    "role": "user",
                    "content": f'{prompt}'
                }
            ],
            temperature = 1,
            max_tokens = 256,
            top_p = 1,
            frequency_penalty = 0,
            presence_penalty = 0,
            model="gpt-3.5-turbo",
        )

    else:
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f'{context_persona}'
                },
                                {
                    "role": "system",
                    "content": f'{context_surroundings}'
                },
                {
                    "role": "user",
                    "content": f'{prompt}'
                }
            ],
            temperature = 1,
            max_tokens = 256,
            top_p = 1,
            frequency_penalty = 0,
            presence_penalty = 0,
            model="gpt-3.5-turbo",
        )

    return completion.choices[0].message.content

def explain(prompt, explanation):
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f'{context_persona}'
            },
            {
                "role": "system",
                "content": f'{context_elaborate}'
            },
            #Explanation is the explanation of the word in the list
            {
                "role": "assistant",
                "content": f'{explanation}'
            },
            #Prompt in this  case is something along the lines of "tell me more about that"
            {
                "role": "user",
                "content": f'{prompt}'
            }
        ],
        temperature = 1,
        max_tokens = 256,
        top_p = 1,
        frequency_penalty = 0,
        presence_penalty = 0,
        model="gpt-3.5-turbo",
    )

    return completion.choices[0].message.content