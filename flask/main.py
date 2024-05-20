from flask import Flask, request, jsonify
from gpt import chat, explain
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS, POST'
    return response

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    prompt = data.get('prompt')
    chat_logs = data.get('chat_logs', [])
    response = chat(prompt, chat_logs)
    return add_cors_headers(jsonify({'response': response}))

@app.route('/explain', methods=['POST'])
def explain_endpoint():
    data = request.json
    prompt = data.get('prompt')
    explanation = data.get('explanation')
    word = data.get('word')
    response = explain(f'{prompt}, {word}', explanation)
    return add_cors_headers(jsonify({'response': response}))

if __name__ == '__main__':
    app.run(debug=True)
