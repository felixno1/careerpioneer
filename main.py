from flask import Flask, render_template, request, make_response, redirect, url_for, jsonify
import json
from src.lang import languages
from src.skills import skills, weighted_shuffle
from src.CareerPioneer import predict_jobs
from src.gpt import chat, explain


app = Flask(__name__)    

class sesh:
    recommendations = {}
    chat_logs = []

def handle_cookie(request, endpoint_name):
    print("Endpoint Name:", endpoint_name)  # Debug print
    selected_language_code = request.form['language']
    response = make_response(redirect(url_for(endpoint_name)))
    print("Redirect URL:", url_for(endpoint_name))  # Debug print
    response.set_cookie('preferred_language', selected_language_code, max_age=60*60*24*30)
    #selected_language = next((lang for lang in languages if lang['code'] == selected_language_code), None)
    return response

def get_lang():
    # Attempt to retrieve the preferred language code from the cookie
    preferred_language_code = request.cookies.get('preferred_language')
    preferred_language = next((lang for lang in languages if lang['code'] == preferred_language_code), None)
    # Load its content and convert it into a dictionary
    if preferred_language_code == None:
        preferred_language_code = "se"
    with open(f'locales/{preferred_language_code}/lang.json', 'r') as file:
        translations = json.load(file)
    return preferred_language, translations

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return handle_cookie(request, 'index')
    else:
        preferred_language, translations = get_lang()
        return render_template('index.html', languages=languages, preferred_language=preferred_language, translations=translations)

@app.route('/guidance', methods=['GET', 'POST'])
def guidance():
    if request.method == 'POST':
        return handle_cookie(request, 'guidance')
    else:
        preferred_language, translations = get_lang()

        return render_template('guidance.html', languages=languages, preferred_language=preferred_language, translations=translations, chat_logs=sesh.chat_logs)

@app.route('/careersearch', methods=['GET', 'POST'])
def careersearch():
    if request.method == 'POST':
        return handle_cookie(request, 'careersearch')
    else:
        preferred_language, translations = get_lang()
        shuffled_skills = weighted_shuffle(skills)
        return render_template('careersearch/start.html', languages=languages, preferred_language=preferred_language, translations=translations, skills=shuffled_skills)


#route-functions:
@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    sesh.chat_logs.append(data)
    answer = {'gpt':chat(data, sesh.chat_logs)}
    sesh.chat_logs.append(answer)
    return jsonify(sesh.chat_logs)

@app.route('/explain', methods=['POST'])
def elaborate():
    data = request.get_json()
    description = data.get('description')
    word = data.get('title')
    elaborate = data.get('elaborate')
    prompt = f'{elaborate} {word}'
    message = {'user':prompt}
    answer = {'gpt':explain(description, prompt)}
    sesh.chat_logs.append(message)
    sesh.chat_logs.append(answer)
    print(answer)
    return jsonify(sesh.chat_logs)


@app.route('/update-skills', methods=['POST'])
def update_skills():
    selected_skills = request.json
    for skill in skills:
        if skill.name in selected_skills:
            skill.bool = True

    sesh.recommendations = predict_jobs(selected_skills, 5)
    #Collect Data
    #if Config.Data.ENABLE:
    #    api.sheets.collect_data(selected_skills)
    return redirect(url_for('show_recommendations'))

@app.route('/show-recommendations', methods=['GET', 'POST'])
def show_recommendations():
    if request.method == 'POST':
        return handle_cookie(request, 'careersearch')
    else:
        preferred_language, translations = get_lang()
        recommendations = sesh.recommendations
        print(recommendations)
        if len(recommendations) > 0:
            return render_template('careersearch/recommendations.html', languages=languages, preferred_language=preferred_language, translations=translations, recommendations=recommendations)
        else:
            return "No recommendations available"


if __name__ == '__main__':
    app.run(debug=True)







def gpt_response(data, chat_logs):
    answer = {'gpt': chat(data, chat_logs)}
    chat_logs.append(answer)  # Update the session logs once the GPT response is received
    print(chat_logs)