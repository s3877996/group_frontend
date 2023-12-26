from flask import Flask, Blueprint
from .database.db import db
from server.resources.routes import auth_blueprint, jwt
from flask_cors import CORS
import os

def create_db(app):
    if not os.path.exists('server/database.db'): 
        with app.app_context():
            db.create_all()
        print('Database created')

def create_app(config_file='config.py'):
    app = Flask(__name__)
    app.config.from_pyfile(config_file)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'
    print(SECRET_KEY)
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['JWT_SECRET_KEY'] = '2B4B6150645367566B5970337336763979244226452948404D6351655468576D'

    # Initialize database
    db.init_app(app)
    create_db(app)

    # Initialize CORS
    CORS(app)

    # Initialize JWT
    jwt.init_app(app)

    # Register blueprint/routes
    app.register_blueprint(auth_blueprint, url_prefix='/api')

    return app