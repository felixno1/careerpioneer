from flask import Flask, render_template
from lib.lang import languages

app = Flask(__name__)

@app.route('/')
def index():

    return render_template('index.html', languages=languages)

if __name__ == '__main__':
    app.run(debug=True)