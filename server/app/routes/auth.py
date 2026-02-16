from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from app.auth_utils import hash_password, verify_password, create_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400
    email = data["email"].strip().lower()
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    user = User(
        email=email,
        password_hash=hash_password(data["password"]),
        is_admin=data.get("is_admin", False),
    )
    db.session.add(user)
    db.session.commit()
    token = create_token(user.id)
    return jsonify({"user": user.to_dict(), "token": token}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400
    user = User.query.filter_by(email=data["email"].strip().lower()).first()
    if not user or not verify_password(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401
    token = create_token(user.id)
    return jsonify({"user": user.to_dict(), "token": token}), 200
