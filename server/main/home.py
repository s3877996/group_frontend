from flask import Blueprint

home_bp = Blueprint('home_bp', __name__)

@home_bp.route('/home')
def home():
    return "This is homepage"