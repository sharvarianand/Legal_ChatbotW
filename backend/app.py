from flask import Flask, request, jsonify
from flask_cors import CORS
from together import Together
import os
from dotenv import load_dotenv
from routes.chatbot import chatbot_bp  # Import the Blueprint

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register the chatbot Blueprint
app.register_blueprint(chatbot_bp, url_prefix="/api")

# Set your Together API key
API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise ValueError("TOGETHER_API_KEY environment variable is not set.")

client = Together(api_key=API_KEY)

# You need to implement the generate_response function in services/ai_integration.py
# Here's what it might look like:

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        return "Welcome to the Legal Chatbot API! Make a POST request to interact."
    elif request.method == 'POST':
        return handle_chat_request()

@app.route('/chat', methods=['POST'])
def chat():
    return handle_chat_request()

def handle_chat_request():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        response = client.chat.completions.create(
            model="meta-llama/Llama-Vision-Free",
            messages=[{"role": "user", "content": f"Provide a well-structured, point-wise legal advice response for the following query:\n{prompt}"}],
            max_tokens=300  # Limit response length
        )

        formatted_response = "\n".join([f"• {line.strip()}" for line in response.choices[0].message.content.split('\n') if line.strip()])
        
        # This would be a good place to save to the database
        
        return jsonify({"response": formatted_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)