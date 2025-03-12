from flask import Blueprint, request, jsonify
import logging

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/api/chat', methods=['POST'])
def chat():
    logging.info("Received request: %s", request.json)
    # ...existing code...
    response = {"status": "ok", "message": "Response from chatbot"}
    logging.info("Sending response: %s", response)
    return jsonify(response)

# Add a test endpoint
@chatbot_bp.route('/api/test', methods=['GET'])
def test():
    return jsonify({"status": "ok", "message": "Test endpoint working"})
