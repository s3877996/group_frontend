from flask import request, jsonify
from server.database.db import db
from server.database.models import User
from .validate import (validate_email_and_password, validate_user, validate)
import os, jwt

# Signin - Signup services
# Signup
def register_user_service():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"message": "Please provide user details", "error": "Bad request"}), 400

        # Call User.create with the appropriate arguments, including package_id=1
        new_user = User.create(
            username=user_data['username'],
            user_email=user_data['user_email'],
            user_password=user_data['user_password'],
            package_id=1  # Set package_id to 1
        )

        if new_user is False:
            return jsonify({"message": "User already exists", "error": "Conflict"}), 409

        # Convert the User object to a JSON-serializable dictionary
        user_data_json = {
            "user_id": new_user.user_id,
            "username": new_user.username,
            "user_email": new_user.user_email,
            "package_id": 1,  # Use the actual value of package_id here
            "start_time": new_user.start_time.isoformat(),
            # "active": new_user.active,
            # Include other fields as needed
        }

        return jsonify({"message": "Successfully created new user", "data": user_data_json}), 201

    except Exception as e:
        return jsonify({"message": "Something went wrong", "error": str(e)}), 500




# Signin
def login_service():
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
                secret_key = os.getenv('SECRET_KEY')
                # Convert the User object to a dictionary
                user_data = {"user_id": user.user_id, "username": user.username, "user_email": user.user_email,
                             "token": jwt.encode(
                                 {"user_id": str(user.user_id)},
                                 secret_key,
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


# Get current user
def get_current_user_service(current_user):
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


# Update user
# def update_user_service(current_user):
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
def update_user_service(current_user):
    try:
        user_data = request.json
        if user_data.get("username") or user_data.get("user_password"):
            user = User.query.get(current_user["_id"])
            if not user:
                return jsonify({"message": "User not found", "error": "Not Found"}), 404

            # Update user data
            user_data = user.update(
                username=user_data.get("username"),
                user_password=user_data.get("user_password"),
            )

            # Commit the changes to the database
            db.session.commit()

            return jsonify({
                "message": "Successfully updated account",
                "data": user_data
            }), 200

        return jsonify({
            "message": "Invalid data, you can only update your account name or password",
            "data": None,
            "error": "Bad Request"
        }), 400

    except Exception as e:
        return jsonify({
            "message": "Failed to update account",
            "error": str(e),
            "data": None
        }), 500


# Delete user
# def delete_user_service(current_user):
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

# Handle errors
def forbidden_service(e):
    return jsonify({"message": "Forbidden", "error": str(e)}), 403


def not_found_service(e):
    return jsonify({"message": "Endpoint Not Found", "error": str(e)}), 404
