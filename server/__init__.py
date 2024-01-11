from flask import Flask, Blueprint
from .database.db import db
from .admin.routes import admins
from .auth.routes import auth
from .payment.routes import payment
from .package.routes import package
from flask_cors import CORS
import os, jwt

from .database.models import Package


def create_db(app):
    if not os.path.exists('server/database.db'): 
        with app.app_context():
            # Check if the default package exists
            default_package = Package.query.filter(id==1)

            if not default_package:
                # If not, create and add the default package
                default_package = Package(
                    id=1,
                    package_name='Trial Package',
                    package_period='1 month',
                    limited_docs='2',
                    package_price=0.0,
                    package_description='Free plan subcription for user',
                )
                db.session.add(default_package)
                db.session.commit()
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
    app.register_blueprint(payment, url_prefix='/api')
    app.register_blueprint(package, url_prefix='/api')

    app.register_blueprint(admins)

    # Run application
    return app