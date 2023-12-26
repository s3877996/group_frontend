from .admin import AdminApi
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt, generate_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from server.database.models import User
from server.database.db import db
import jwt, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from server.resources.validate import validate_email_and_password, validate_user, validate
from .auth_middleware import token_required
import logging
from server.database.models import User


load_dotenv()

app = Flask(__name__)
SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'
print(SECRET_KEY)
app.config['SECRET_KEY'] = SECRET_KEY
auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/")
def hello():
    return "Hello World!"


@auth_blueprint.route("/register", methods=["POST"])
def register_user():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"message": "Please provide user details", "error": "Bad request"}), 400

        new_user = User.create(**user_data)
        if new_user is False:
            return jsonify({"message": "User already exists", "error": "Conflict"}), 409

        # Convert the User object to a JSON-serializable dictionary
        user_data_json = {
            "user_id": new_user.user_id,
            "username": new_user.username,
            "user_email": new_user.user_email,
            "package_id": new_user.package_id,
            "start_time": new_user.start_time.isoformat(),
            # "active": new_user.active,
            # Include other fields as needed
        }

        return jsonify({"message": "Successfully created new user", "data": user_data_json}), 201

    except Exception as e:
        return jsonify({"message": "Something went wrong", "error": str(e)}), 500



@auth_blueprint.route("/users/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return {
                       "message": "Please provide user details",
                       "data": None,
                       "error": "Bad request"
                   }, 400
        # validate input
        is_validated = validate_email_and_password(data.get('email'), data.get('password'))
        if is_validated is not True:
            return dict(message='Invalid data', data=None, error=is_validated), 400
        user = User().login(
            data["email"],
            data["password"]
        )
        if user:
            try:
                # Convert the User object to a dictionary
                user_data = {"user_id": user.user_id, "username": user.username, "user_email": user.user_email,
                             "token": jwt.encode(
                                 {"user_id": str(user.user_id)},
                                 app.config["SECRET_KEY"],
                                 algorithm="HS256"
                             )}

                # Assuming your User object has a 'token' attribute

                return {
                    "message": "Successfully fetched auth token",
                    "data": user_data
                }
            except Exception as e:
                return {
                    "error": "Something went wrong",
                    "message": str(e)
                }, 500
        return {
                   "message": "Error fetching auth token!, invalid email or password",
                   "data": None,
                   "error": "Unauthorized"
               }, 404
    except Exception as e:
        return {
                   "message": "Something went wrong!",
                   "error": str(e),
                   "data": None
               }, 500



@auth_blueprint.route("/users", methods=["GET"])
@token_required
def get_current_user(current_user):
    try:
        # Convert the User object to a JSON-serializable dictionary
        user_data_json = {
            "user_id": current_user.user_id,
            "username": current_user.username,
            "user_email": current_user.user_email,
            "package_id": current_user.package_id,
            "start_time": current_user.start_time.isoformat(),
            # Include other fields as needed
        }

        return jsonify({"message": "Successfully retrieved user profile", "data": user_data_json})
    except Exception as e:
        return jsonify({"message": "Something went wrong", "error": str(e)}), 500


# @auth_blueprint.route("/users", methods=["PUT"])
# @token_required
# def update_user(current_user):
#     try:
#         user = request.json
#         if user.get("username"):
#             user = User().update(current_user["_id"], user["username"])
#             return jsonify({
#                 "message": "successfully updated account",
#                 "data": user
#             }), 201
#         return {
#                    "message": "Invalid data, you can only update your account name!",
#                    "data": None,
#                    "error": "Bad Request"
#                }, 400
#     except Exception as e:
#         return jsonify({
#             "message": "failed to update account",
#             "error": str(e),
#             "data": None
#         }), 400
#
# @auth_blueprint.route("/users", methods=["DELETE"])
# @token_required
# def delete_user(current_user):
#     try:
#         if current_user and isinstance(current_user, User):
#             # Assuming you want to delete the user record
#             current_user.delete_account()
#
#             return jsonify({
#                 "message": "Successfully deleted the user account",
#                 "data": None
#             }), 200
#         else:
#             return jsonify({
#                 "message": "User not found",
#                 "data": None,
#                 "error": "Not Found"
#             }), 404
#
#     except Exception as e:
#         return jsonify({
#             "message": "Failed to delete user account",
#             "error": str(e),
#             "data": None
#         }), 500


@auth_blueprint.errorhandler(403)
def forbidden(e):
    return jsonify({"message": "Forbidden", "error": str(e)}), 403


@auth_blueprint.errorhandler(404)
def not_found(e):
    return jsonify({"message": "Endpoint Not Found", "error": str(e)}), 404


def initialize_routes(api):
    api.add_resource(AdminApi, '/api/auth')