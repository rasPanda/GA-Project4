# pylint: disable=import-error
from flask import request, g
import jwt
from models.user import User
from config.environment import secret
from functools import wraps

def secure_route(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token_with_bearer = request.headers.get('Authorization')
        token = token_with_bearer.replace("Bearer ", "")
        try: 
            payload = jwt.decode(token, secret, 'HS256')
            user_id = payload['sub']
            user = User.query.get(user_id)
            if not user:
                return { "messages": "Unauthorized" }, 401
            g.current_user = user
        except jwt.ExpiredSignatureError: 
             return { "messages": "Session timeout, please log in!" }, 401
        except Exception:
            return { "messages": "Unauthorized" }, 401
        return func(*args, **kwargs)
    return wrapper