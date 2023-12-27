from flask import Flask, Blueprint
from .database.db import db
from .admin.routes import admins
from .auth.routes import auth
from flask_cors import CORS
import os, jwt

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

    # Initialize CORS
    CORS(app)

    # Initialize JWT
    # jwt.init_app(app)

    # Register blueprint/routes
    app.register_blueprint(auth, url_prefix='/api')
    app.register_blueprint(admins)

    # Run application
    return app