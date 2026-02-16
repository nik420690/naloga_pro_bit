"""
One-time script to create an admin user. Run from server directory:
  python seed_admin.py

Requires DB to exist and SQLALCHEMY_DATABASE_URI to be set (e.g. in .env).
"""
import os
import sys

# Add parent so app can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User
from app.auth_utils import hash_password

def main():
    app = create_app()
    with app.app_context():
        email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
        password = os.environ.get("ADMIN_PASSWORD", "admin123")
        if User.query.filter_by(email=email).first():
            print(f"User {email} already exists.")
            return
        user = User(
            email=email,
            password_hash=hash_password(password),
            is_admin=True,
        )
        db.session.add(user)
        db.session.commit()
        print(f"Admin created: {email} (password: {password})")
        print("Change password after first login in production.")


if __name__ == "__main__":
    main()
