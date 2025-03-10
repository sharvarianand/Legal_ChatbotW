import requests

url = "http://127.0.0.1:5000/chat"  # Updated endpoint
data = {"prompt": "Hello, how can I get legal advice?"}  # Updated key

response = requests.post(url, json=data)

print(response.json())
