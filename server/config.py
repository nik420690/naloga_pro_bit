import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key"
    # Default: MySQL. Create DB and user, then set SQLALCHEMY_DATABASE_URI in .env
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI") or (
        "mysql+pymysql://cars_user:cars_pass@localhost:3306/cars_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or SECRET_KEY
