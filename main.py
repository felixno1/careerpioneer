from flask import Flask, render_template
from lib.test import get_sisters

app = Flask(__name__)

@app.route('/')
def index():
    sisters = get_sisters()
    return render_template('index.html', test=sisters)

if __name__ == '__main__':
    app.run(debug=True)