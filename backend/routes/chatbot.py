from flask import Blueprint, request, jsonify
from services.ai_integration import generate_response

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    bot_reply = generate_response(user_message)
    return jsonify({"reply": bot_reply})
