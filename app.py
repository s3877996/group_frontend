from server import create_app
from flask import Flask, Blueprint
from server.resources.routes import auth_blueprint
from flask_sqlalchemy import SQLAlchemy
# Import the auth_blueprint
# Import and initialize database


app = create_app()

for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == '__main__':
    app.run(debug=True)
