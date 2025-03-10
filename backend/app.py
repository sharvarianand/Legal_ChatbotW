from flask import Flask, request, jsonify
from flask_cors import CORS
from together import Together
import os
from dotenv import load_dotenv  # Add this import

# Load environment variables from .env file
load_dotenv()  # Add this line

app = Flask(__name__)
CORS(app)

# Set your Together API key
API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise ValueError("TOGETHER_API_KEY environment variable is not set.")

client = Together(api_key=API_KEY)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        return "Welcome to the Legal Chatbot API! Make a POST request to interact."
    elif request.method == 'POST':
        # Redirect POST requests to the chat function
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
        return jsonify({"response": formatted_response})
    except Exception as e:
        return jsonify({"error": "An error occurred while processing the request: " + str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)