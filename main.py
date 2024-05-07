from flask import Flask, render_template, request, make_response, redirect, url_for
import json
from src.lang import languages

app = Flask(__name__)        

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
        preferred_language_code = "en"

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
        return render_template('guidance.html', languages=languages, preferred_language=preferred_language, translations=translations)

@app.route('/careersearch', methods=['GET', 'POST'])
def careersearch():
    if request.method == 'POST':
        return handle_cookie(request, 'careersearch')
    else:
        preferred_language, translations = get_lang()
        return render_template('careersearch.html', languages=languages, preferred_language=preferred_language, translations=translations)


if __name__ == '__main__':
    app.run(debug=True)



