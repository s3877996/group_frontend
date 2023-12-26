from flask import Blueprint, Response
from flask_restful import Resource

admin = Blueprint('admin', __name__)

class AdminApi(Resource):
    def admin(self):
        return "This is admin page"