from flask import Flask, Blueprint, request
from .database.db import db
import os

def create_db(app):
    if not os.path.exists('server/database.db'): 
        with app.app_context():
            db.create_all()
        print('Database created')

def create_app(config_file='config.py'):
    app = Flask(__name__)
    app.config.from_pyfile(config_file)

    # Initialize database
    db.init_app(app)
    create_db(app)

    # Register blueprint/routes

    return app