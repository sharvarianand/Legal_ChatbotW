from flask import request, jsonify
import time
import threading

# Simple in-memory rate limiter
class RateLimiter:
    def __init__(self, requests_per_minute=20):
        self.requests_per_minute = requests_per_minute
        self.requests = {}  # IP -> list of timestamps
        self.lock = threading.Lock()
        
        # Start a thread to clean up old requests
        self._start_cleanup_thread()
    
    def _start_cleanup_thread(self):
        """Start a thread to clean up old request data."""
        def cleanup():
            while True:
                time.sleep(60)  # Clean up every minute
                self._cleanup_old_requests()
        
        thread = threading.Thread(target=cleanup, daemon=True)
        thread.start()
    
    def _cleanup_old_requests(self):
        """Remove requests older than 1 minute."""
        now = time.time()
        with self.lock:
            for ip in list(self.requests.keys()):
                # Filter to keep only requests within the last minute
                self.requests[ip] = [t for t in self.requests[ip] if now - t < 60]
                # Remove empty entries
                if not self.requests[ip]:
                    del self.requests[ip]
    
    def is_rate_limited(self):
        """Check if the current request is rate-limited."""
        ip = request.remote_addr
        now = time.time()
        
        with self.lock:
            # Initialize if this is the first request from this IP
            if ip not in self.requests:
                self.requests[ip] = []
            
            # Count requests in the last minute
            self.requests[ip] = [t for t in self.requests[ip] if now - t < 60]
            request_count = len(self.requests[ip])
            
            # Check if rate limit exceeded
            if request_count >= self.requests_per_minute:
                return True
            
            # Add this request
            self.requests[ip].append(now)
            return False

# Create an instance
rate_limiter = RateLimiter()

# Decorator for rate-limited routes
def rate_limit(f):
    def decorated_function(*args, **kwargs):
        if rate_limiter.is_rate_limited():
            return jsonify({
                "error": "Rate limit exceeded. Please try again later."
            }), 429
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function