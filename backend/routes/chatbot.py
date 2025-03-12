from flask import Blueprint, request, jsonify
from services.ai_integration import generate_response
import sqlite3
from datetime import datetime
import os

chatbot_bp = Blueprint("chatbot", __name__)

# Create database if it doesn't exist
def init_db():
    db_path = 'backend/services/chat_history.db'
    # Ensure directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database when module is imported
init_db()

@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    # Debug log for incoming data
    data = request.get_json()
    print(f"Incoming data: {data}")  # Debug log for incoming data

    """
    Handle chat requests from the frontend.
    
    Expected request format:
    {
        "prompt": "User's legal question",
        "conversation_history": [
            {"text": "Previous message", "sender": "user", "timestamp": "ISO timestamp"},
            {"text": "Previous response", "sender": "bot", "timestamp": "ISO timestamp"}
        ]
    }
    
    Returns:
    {
        "response": "AI-generated legal response"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        prompt = data.get("prompt", "")
        conversation_history = data.get("conversation_history", [])
        
        if not prompt:
            return jsonify({"error": "Prompt cannot be empty"}), 400
            
        bot_reply = generate_response(prompt, conversation_history)
        
        return jsonify({"response": bot_reply})
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chatbot_bp.route("/history", methods=["GET"])
def get_history():
    """
    Retrieve chat history from the database.
    
    Optional query parameters:
    - limit: Maximum number of messages to return (default: 50)
    - user_id: Filter by user ID (default: all users)
    
    Returns:
    {
        "history": [
            {
                "id": 1,
                "user_id": "user",
                "message": "User message",
                "timestamp": "ISO timestamp"
            },
            {
                "id": 2,
                "user_id": "bot",
                "message": "Bot response",
                "timestamp": "ISO timestamp"
            }
        ]
    }
    """
    try:
        # Get query parameters
        limit = request.args.get('limit', default=50, type=int)
        user_id = request.args.get('user_id', default=None)
        
        # Connect to the database
        conn = sqlite3.connect('backend/services/chat_history.db')
        conn.row_factory = sqlite3.Row  # This enables column access by name
        c = conn.cursor()
        
        # Build the query
        query = "SELECT * FROM chat_history"
        params = []
        
        if user_id:
            query += " WHERE user_id = ?"
            params.append(user_id)
            
        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)
        
        # Execute the query
        c.execute(query, params)
        
        # Process the results
        chat_history = []
        for row in c.fetchall():
            chat_history.append({
                "id": row['id'],
                "user_id": row['user_id'],
                "message": row['message'],
                "timestamp": row['timestamp']
            })
            
        conn.close()
        
        return jsonify({"history": chat_history})
        
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chatbot_bp.route("/clear", methods=["POST"])
def clear_history():
    """
    Clear chat history from the database.
    
    Returns:
    {
        "success": true,
        "message": "Chat history cleared"
    }
    """
    try:
        conn = sqlite3.connect('backend/services/chat_history.db')
        c = conn.cursor()
        c.execute("DELETE FROM chat_history")
        conn.commit()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": "Chat history cleared"
        })
        
    except Exception as e:
        print(f"Error clearing chat history: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
