from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)
    db.init_app(app)

    from app.routes import auth_bp, cars_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(cars_bp, url_prefix="/api/cars")

    with app.app_context():
        db.create_all()

    return app
