from flask import Flask
from server.main.home import home_bp
from server.main.admin import admin_bp

app = Flask(__name__)
app.register_blueprint(home_bp)
app.register_blueprint(admin_bp)