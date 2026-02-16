import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from functools import wraps
from flask import request, jsonify
from app.models import User


def hash_password(password):
    return generate_password_hash(password, method="pbkdf2:sha256")


def verify_password(password_hash, password):
    return check_password_hash(password_hash, password)


def create_token(user_id):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


def decode_token(token):
    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"],
        )
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401
        token = auth_header.split(" ")[1]
        user_id = decode_token(token)
        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)

    return decorated
