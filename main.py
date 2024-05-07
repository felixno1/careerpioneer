from flask import Flask, render_template, request, make_response, redirect, url_for
import json
from src.lang import languages




app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Retrieve the language code from the form data
        selected_language_code = request.form['language']
        # Find the language name using the code
        selected_language = next((lang for lang in languages if lang['code'] == selected_language_code), None)
        # Create response and set a cookie with the selected language code
        response = make_response(redirect(url_for('index')))
        response.set_cookie('preferred_language', selected_language_code, max_age=60*60*24*30)
        return response
    else:
        # Attempt to retrieve the preferred language code from the cookie
        preferred_language_code = request.cookies.get('preferred_language')
        preferred_language = next((lang for lang in languages if lang['code'] == preferred_language_code), None)
        # Load its content and convert it into a dictionary
        if preferred_language_code == None:
            preferred_language_code = "en"

        with open(f'locales/{preferred_language_code}/lang.json', 'r') as file:
            translations = json.load(file)
        return render_template('index.html', languages=languages, preferred_language=preferred_language, translations=translations)

if __name__ == '__main__':
    app.run(debug=True)


