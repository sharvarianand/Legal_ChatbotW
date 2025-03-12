import unittest
from app import app

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_check(self):
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'{"status": "ok"', response.data)

    def test_chat_endpoint(self):
        response = self.app.post('/chat', json={
            "prompt": "What is the legal age for drinking?",
            "conversation_id": "test-convo-id"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'response', response.data)

if __name__ == '__main__':
    unittest.main()
