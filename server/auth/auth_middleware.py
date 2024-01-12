from functools import wraps
import jwt
from flask import request, current_app, jsonify
from server.database.models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }), 401

        try:
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if current_user is None:
                return jsonify({
                    "message": "Invalid Authentication token!",
                    "data": None,
                    "error": "Unauthorized"
                }), 401

        except jwt.ExpiredSignatureError:
            return jsonify({
                "message": "Token has expired!",
                "data": None,
                "error": "Unauthorized"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "message": "Invalid Authentication token!",
                "data": None,
                "error": "Unauthorized"
            }), 401

        return f(current_user, *args, **kwargs)

    return decorated
