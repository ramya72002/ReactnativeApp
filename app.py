from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from googletrans import Translator

app = Flask(__name__)
CORS(app)

translator = Translator()

users = []

def time_now():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

@app.route('/time')
def serve_time():
    return jsonify({"time": time_now()})

@app.route('/tips')
def serve_tips():
    url = 'https://www.aad.org/public/diseases/acne/skin-care/tips'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        sections = soup.find_all('section', {'class': 'row has-sidebar'})
        tips = []
        for section in sections:
            p_tags = section.find_all('p')
            for p in p_tags:
                tips.append(p.get_text())
        return jsonify({'tips': tips})
    else:
        return 'Failed to fetch tips'

def translate_words(sentences, dest_language):
    translated_sentences = []
    for sentence in sentences:
        translated_sentence = translator.translate(sentence, dest=dest_language).text
        translated_sentences.append(translated_sentence)
    return translated_sentences

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    content = data.get('content')
    target_language = data.get('language')

    if not content or not target_language:
        return jsonify({'error': 'Content and language are required'}), 400

    try:
        translated_content = translate_words(content, target_language)
        return jsonify({'translated_text': translated_content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/signup', methods=['POST'])
def signup():
    user_data = request.get_json()
    users.append(user_data)
    return jsonify({'success': True}), 201

@app.route('/login', methods=['POST'])
def login():
    login_data = request.get_json()
    email = login_data.get('email')
    password = login_data.get('password')

    for user in users:
        if user['email'] == email and user['password'] == password:
            return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
