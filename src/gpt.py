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

context_persona = "Act as a career counselor bot who is an expert in Swedish employment laws and other related terminology concerning the Swedish job market. The user is a migrant that has moved to sweden and is looking for guidance in getting a job. Respond in whatever language the user employs, ensuring that your answers are brief and informative, yet easy to understand."

context_surroundings = "You are in a webpage. There are 4 sections: Common terminology, Legal & regulations, chat and a tool to get personalized job recommendations. If the user asks general confused questions or says something unrelated to the swedish job market, you may tell them about the sections and guide them around the site."

context_elaborate = "You give the user advice about a topic, and do not repeat information you have already said."

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
            model="gpt-3.5-turbo",
        )

    return completion.choices[0].message.content

def explain(explanation, prompt):
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
        model="gpt-3.5-turbo",
    )

    return completion.choices[0].message.content