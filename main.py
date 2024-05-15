import json
from flask import Flask, render_template, request, make_response, redirect, url_for, jsonify
from src.skills import load_skills, weighted_shuffle
from src.CareerPioneer import predict_jobs
from src.gpt import chat, explain
from src.jobsearch import search_number_of_hits

app = Flask(__name__)

class Session:
    recommendations = {}
    chat_logs = []
    skills = []

languages = [
    {"name":"English","code": "en"},
    {"name":"Afrikaans","code": "af"},
    {"name":"Arabic (عربي)","code": "ar"},
    {"name":"Dari (دری)","code": "da"},
    {"name":"French (Français)","code": "fr"},
    {"name":"Hindi (हिन्दी)","code": "hi"},
    {"name":"Japanese (日本語)","code": "ja"},
    {"name":"Korean (한국어)","code": "ko"},
    {"name":"Mandarin (普通话)","code": "ma"},
    {"name":"Persian (فارسی)","code": "pe"},
    {"name":"Polish (Polski)","code": "po"},
    {"name":"Romanian (Română)","code": "ro"},
    {"name":"Russian (Русский)","code": "ru"},
    {"name":"Somali (Soomaali)","code": "so"},
    {"name":"Thai (ไทย)","code": "th"},
    {"name":"Turkish (Türkçe)","code": "tu"},
    {"name":"Yiddish (ייִדיש)","code": "yi"},
    {"name":"Swedish","code": "se"}
]


def handle_cookie(request, endpoint_name):
    selected_language_code = request.form.get('language', 'en')
    response = make_response(redirect(url_for(endpoint_name)))
    response.set_cookie('preferred_language', selected_language_code, max_age=60*60*24*30)
    return response

def get_lang():
    preferred_language_code = request.cookies.get('preferred_language', 'en')
    with open(f'locales/{preferred_language_code}/lang.json', 'r') as file:
        translations = json.load(file)
    return next((lang for lang in languages if lang['code'] == preferred_language_code), None), preferred_language_code, translations

def translate_job(jsonl_file):
    data_dict = {}
    with open(jsonl_file, 'r', encoding='utf-8') as f:
        for line in f:
            json_data = json.loads(line)
            data_dict[json_data['job']] = json_data['translation']
    return data_dict

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return handle_cookie(request, 'index')
    else:
        preferred_language, _, translations = get_lang()
        return render_template('index.html', languages=languages, preferred_language=preferred_language, translations=translations)

@app.route('/guidance', methods=['GET', 'POST'])
def guidance():
    if request.method == 'POST':
        return handle_cookie(request, 'guidance')
    else:
        preferred_language, _, translations = get_lang()
        return render_template('guidance.html', languages=languages, preferred_language=preferred_language, translations=translations, chat_logs=Session.chat_logs)

@app.route('/careersearch', methods=['GET', 'POST'])
def careersearch():
    if request.method == 'POST':
        return handle_cookie(request, 'careersearch')
    else:
        preferred_language, preferred_language_code, translations = get_lang()
        Session.skills = load_skills(preferred_language_code)
        shuffled_skills = weighted_shuffle(Session.skills)
        return render_template('careersearch/start.html', languages=languages, preferred_language=preferred_language, translations=translations, skills=shuffled_skills)

@app.route('/show-recommendations', methods=['GET', 'POST'])
def show_recommendations():
    if request.method == 'POST':
        return handle_cookie(request, 'careersearch')
    else:
        preferred_language, preferred_language_code, translations = get_lang()
        recommendations = Session.recommendations
        jobs = translate_job(f'locales/{preferred_language_code}/jobs.jsonl') if Session.recommendations else {}
        for job in recommendations:
            ads = search_number_of_hits(job['title'])
            job['ads'] = int(ads)
            job['translation'] = jobs.get(job['title'], job['title'])
        if recommendations:
            return render_template('careersearch/recommendations.html', languages=languages, preferred_language=preferred_language, translations=translations, recommendations=recommendations)
        else:
            return "No recommendations available"

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    Session.chat_logs.append(data)
    Session.chat_logs.append({'gpt': chat(data, Session.chat_logs)})
    return jsonify(Session.chat_logs)

@app.route('/explain', methods=['POST'])
def elaborate():
    data = request.get_json()
    prompt = f"{data.get('elaborate')} {data.get('title')}"
    Session.chat_logs.append({'user': prompt})
    Session.chat_logs.append({'gpt': explain(data.get('description'), prompt)})
    return jsonify(Session.chat_logs)

@app.route('/update-skills', methods=['POST'])
def update_skills():
    Session.recommendations = predict_jobs(request.json, 5)
    return redirect(url_for('show_recommendations'))

if __name__ == '__main__':
    app.run(debug=True)
