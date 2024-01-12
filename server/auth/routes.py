from flask import Blueprint
from .services import (register_user_service, login_service, get_current_user_service, forbidden_service,
                       not_found_service, update_user_service, get_current_sub_sv)
from .auth_middleware import token_required

auth = Blueprint('auth', __name__)


@auth.route("/register", methods=["POST"])
def register_user():
    return register_user_service()


@auth.route("/users/login", methods=["POST"])
def login():
    return login_service()


@auth.route("/users/me/subscription", methods=["GET"])
# @token_required
@token_required(required_role='user')
def get_current_sub(current_user):
    return get_current_sub_sv(current_user)


@auth.route("/users/me", methods=["GET"])
# @token_required
@token_required(required_role='user')
def get_current_user(current_user):
    return get_current_user_service(current_user)


@auth.route("/users/me", methods=["PUT"])
# @token_required
@token_required(required_role='user')
def update_user(current_user):
    return update_user_service(current_user)


@auth.route("/users", methods=["DELETE"])
# @token_required
@token_required(required_role='user')
def delete_user(current_user):
    return "Delete user"


@auth.errorhandler(403)
def forbidden(e):
    return forbidden_service(e)


@auth.errorhandler(404)
def not_found(e):
    return not_found_service(e)