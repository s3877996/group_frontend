from datetime import datetime, timedelta
import logging
from flask import request, jsonify
from server.database.db import db
from server.database.models import Package, Subscription, User
from .validate import (validate_email_and_password, validate_user, validate)
import os, jwt

logger = logging.basicConfig(level=logging.DEBUG)


# Signin - Signup services
# Signup
def register_user_service():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"message": "Please provide user details", "error": "Bad request"}), 400

        # Get user_role from request data, default to 'user'
        user_role = user_data.get('user_role', 'user')

        # Call User.create with the appropriate arguments, including package_id=1
        new_user = User.create(
            username=user_data['username'],
            user_email=user_data['user_email'],
            user_password=user_data['user_password'],
            user_role=user_role  # Pass user_role to the create method
        )

        if new_user is False:
            return jsonify({"message": "User already exists", "error": "Conflict"}), 409

        # # Convert the User object to a JSON-serializable dictionary
        user_data_json = {
            "user_id": new_user.user_id,
            "username": new_user.username,
            "user_email": new_user.user_email,
            "user_role": new_user.user_role,  # Include the user_role in the response
            "package_id": 1,  # Use the actual value of package_id here
            "start_time": new_user.user_joined_date.isoformat(),
            "active": new_user.active,
            # Include other fields as needed
        }

        Subscription.create(
            package_id=1,
            user_id=new_user.user_id,
            amount=0,
            available_doc=10,
            next_time=datetime.now() + timedelta(days=14)
        )
        return jsonify({"message": "Successfully created new user", "data": user_data_json}), 201

    except Exception as e:
        print("What error!!!")
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
                user_data = {"user_id": user.user_id,
                             "username": user.username,
                             "user_email": user.user_email,
                             "user_role": user.user_role,
                             "fullname": user.user_fullname,
                             "phone": user.phone,
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
                print(e)
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

def before_google_request_service():
    if not google.authorized:
        return redirect(url_for('google.login'))

def google_authorize_service():
    resp = google.get('/plus/v1/people/me')
    user_info = resp.json()
    # Check if the user already exists in your database
    existing_user = User.query.filter_by(email=user_info['emails'][0]['value']).first()
    if existing_user:
        # Log in the existing user
        login_service(existing_user)
    else:
        # Create a new user
        new_user = User(email=user_info['emails'][0]['value'], name=user_info['displayName'])
        db.session.add(new_user)
        db.session.commit()
        # Log in the new user
        login_service(new_user)
    return redirect(url_for('index'))

def google_login_service():
    try:
        # Perform Google login logic here (similar to the google_authorize_service function)
        # ...

        # For demonstration purposes, let's assume you have retrieved user information from Google
        google_user_info = {
            "email": "googleuser@example.com",
            "display_name": "Google User"
        }

        # Check if the user already exists in your database
        existing_user = User.query.filter_by(email=google_user_info['email']).first()

        if existing_user:
            # Log in the existing user using your current login mechanism
            return login_service(existing_user)
        else:
            # Create a new user
            new_user = User(email=google_user_info['email'], name=google_user_info['display_name'])
            db.session.add(new_user)
            db.session.commit()

            # Log in the new user using your current login mechanism
            return login_service(new_user)

    except Exception as e:
        return {
            "error": "Something went wrong during Google login",
            "message": str(e)
        }, 500


# def google_authorized_service():
#     response = google.authorized_response()
#     if response is None or response.get('access_token') is None:
#         return 'Access denied: reason={} error={}'.format(
#             request.args['error_reason'],
#             request.args['error_description']
#         )
#
#     google_user_info = google.get('userinfo')
#     email = google_user_info.data['email']
#
#     # Check if the user already exists in your database, or create a new user
#     user = User.query.filter_by(user_email=email).first()
#
#     if not user:
#         # Create a new user in your database
#         user = User.create(
#             username=google_user_info.data['name'],
#             user_email=email,
#             user_role='user'  # Assign a default role
#         )
#
#     # Generate JWT token
#     token = create_access_token(identity=str(user.user_id))
#
#     # Redirect or return the token as needed
#     return jsonify({"token": token, "user_data": user.to_dict()})


# Get current user
def get_current_user_service(current_user):
    try:
        # Convert the User object to a JSON-serializable dictionary
        sub_current = Subscription.get_by_user_id(current_user.user_id)

        package = Package.get_by_id(sub_current.package_id)
        user_data_json = {
            "limited_docs": package.limited_docs,
            "fullname": current_user.user_fullname,
            "phone": current_user.phone,
            "user_id": current_user.user_id,
            "username": current_user.username,
            "user_email": current_user.user_email,
            "package_id": sub_current.package_id,
            "package_name": sub_current.package.package_name,
            "next_payment": sub_current.next_time.isoformat(),
            "start_time": sub_current.start_time.isoformat(),  # Include other fields as needed
            "available_doc": sub_current.available_doc,  # Include other fields as needed
        }

        return jsonify({"message": "Successfully retrieved user profile", "data": user_data_json})
    except Exception as e:
        return jsonify({"message": "Something went wrong", "error": str(e)}), 500


def get_current_sub_sv(current_user):
    try:
        # Convert the User object to a JSON-serializable dictionary
        subs = Subscription.get_all(current_user.user_id)

        sub_data_json = [{
            "user_id": sub.user_id,
            "package_id": sub.package_id,
            "package_name": sub.package.package_name,
            "amount": sub.amount,
            "status": sub.status,
            "start_time": sub.start_time.isoformat(),
            "next_time": sub.next_time.isoformat(),  # Include other fields as needed
        } for sub in subs]

        return jsonify({"message": "Successfully retrieved subscription", "data": sub_data_json})
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
        if user_data.get("username") is not None or user_data.get("user_password") is not None:
            # Use the current_user object directly
            user_data = User.update(user_id=current_user.user_id,
                                    username=user_data.get("username"),
                                    user_password=user_data.get("user_password"),
                                    user_fullname=user_data.get('fullname'),
                                    phone=user_data.get('phone')
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


# Handle errors
def forbidden_service(e):
    return jsonify({"message": "Forbidden", "error": str(e)}), 403


def not_found_service(e):
    return jsonify({"message": "Endpoint Not Found", "error": str(e)}), 404
