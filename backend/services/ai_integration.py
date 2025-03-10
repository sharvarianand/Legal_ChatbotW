from together import Together
import os
import sqlite3
from datetime import datetime
import re

def generate_response(prompt, conversation_history=None):
    """
    Generate a legal response using the Together AI API.
    
    Args:
        prompt (str): The user's legal question
        conversation_history (list, optional): Previous conversation messages for context
    
    Returns:
        str: The AI-generated legal response
    """
    API_KEY = os.getenv("TOGETHER_API_KEY")
    client = Together(api_key=API_KEY)
    
    # Format conversation history for context if provided
    context = ""
    if conversation_history and len(conversation_history) > 0:
        context = "Previous conversation:\n"
        for msg in conversation_history:
            sender = "User" if msg.get('sender') == 'user' else "Assistant"
            context += f"{sender}: {msg.get('text', '')}\n"
        context += "\n"
    
    # Create a system message to guide the legal assistant
    system_message = (
        "You are a legal assistant specialized in providing accurate legal information. "
        "Provide clear, structured responses with bullet points where appropriate. "
        "Each bullet point should start on a new line. "
        "Format your response in a way that's easy to read with proper spacing between points. "
        "Always note that your responses are for informational purposes only and not a substitute for professional legal advice."
    )
    
    # Create the messages array
    messages = [
        {"role": "system", "content": system_message}
    ]
    
    # Add conversation history if available
    if context:
        messages.append({"role": "user", "content": f"Here's the conversation so far:\n{context}"})
        messages.append({"role": "assistant", "content": "I'll keep this context in mind when answering the next question."})
    
    # Add the current question
    messages.append({"role": "user", "content": f"Legal question: {prompt}\n\nProvide your response in a clear, bullet-point format with each point on a separate line."})
    
    # Make the API call
    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-Vision-Free",
            messages=messages,
            max_tokens=500,
            temperature=0.7,
            presence_penalty=0.6
        )
        
        response_text = response.choices[0].message.content
        
        # Improved formatting for bullet points
        formatted_text = format_bullet_points(response_text)
        
        # Save the interaction to the database
        save_to_db(prompt, formatted_text)
        
        return formatted_text
        
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return f"I'm sorry, I encountered an error while processing your request: {str(e)}"

def format_bullet_points(text):
    """
    Format the response text to ensure bullet points are properly aligned and each on a new line.
    
    Args:
        text (str): The original response text
    
    Returns:
        str: The formatted response text with proper bullet points
    """
    # First, normalize line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Split by lines
    lines = text.split('\n')
    formatted_lines = []
    
    # Check if the text already has bullet points
    has_bullets = any(line.strip().startswith(('•', '-', '*', '1.', '2.')) for line in lines if line.strip())
    
    # Process each line
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            # Keep empty lines for spacing
            formatted_lines.append('')
            continue
            
        if has_bullets:
            # If the line already starts with a bullet or number, ensure proper formatting
            if re.match(r'^[\*\-•]', line):
                # Convert all bullet types to • for consistency
                formatted_lines.append(f"• {line[1:].strip()}")
            elif re.match(r'^\d+\.', line):
                # Keep numbered points as they are
                formatted_lines.append(line)
            else:
                # If it's a continuation of previous bullet point, indent it
                if i > 0 and lines[i-1].strip().startswith(('•', '-', '*', '1.', '2.')):
                    formatted_lines.append(f"  {line}")
                else:
                    # Otherwise, make it a new bullet point
                    formatted_lines.append(f"• {line}")
        else:
            # If no bullet points detected, add them to each non-empty line
            formatted_lines.append(f"• {line}")
    
    # Join the formatted lines
    formatted_text = '\n'.join(formatted_lines)
    
    # Remove any duplicate bullet points that might have been created
    formatted_text = re.sub(r'• • ', '• ', formatted_text)
    
    return formatted_text

def save_to_db(user_message, bot_response):
    """
    Save the conversation to the SQLite database.
    
    Args:
        user_message (str): The user's message
        bot_response (str): The bot's response
    """
    try:
        db_path = 'backend/services/chat_history.db'
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        
        # Make sure the table exists
        c.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        
        # Insert the user message and bot response
        timestamp = datetime.now().isoformat()
        c.execute(
            "INSERT INTO chat_history (user_id, message, timestamp) VALUES (?, ?, ?)", 
            ("user", user_message, timestamp)
        )
        c.execute(
            "INSERT INTO chat_history (user_id, message, timestamp) VALUES (?, ?, ?)", 
            ("bot", bot_response, timestamp)
        )
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"Error saving to database: {str(e)}")