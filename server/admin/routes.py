from flask import Blueprint
from ..auth.auth_middleware import token_required
from .services import (\
        add_package_service, \
        get_all_packages_service, \
        get_package_by_id_service, \
        get_package_by_name_service, \
        update_package_by_id_service, \
        delete_package_by_id_service, \
        get_all_users_service, \
        get_user_by_id_service, \
        get_users_by_name_service, \
        get_users_by_package_id_service, \
        get_users_by_package_name_service, \
        get_subscriptions_count_service, \
        get_subscriptions_revenue_service, \
    )
from ..auth.auth_middleware import token_required

admins = Blueprint('admin', __name__)

# Manage subscriptions
# Add package
@admins.route('/admin/add_package', methods=['POST'])
# @token_required(required_role='admin')
def add_package():
    return add_package_service()


# Get all packages
@admins.route('/admin/get_all_packages', methods=['GET'])
# @token_required(required_role='admin')
def get_all_packages():
    return get_all_packages_service()


# Get package by id
@admins.route('/admin/get_package/<int:package_id>', methods=['GET'])
# @token_required(required_role='admin')
def get_package_by_id(package_id):
    return get_package_by_id_service(package_id)


# Get package by name -- Search (if have)
@admins.route('/admin/get_package', methods=['GET'])
# @token_required(required_role='admin')
def get_package_by_name():
    return get_package_by_name_service()


# Update package by id
@admins.route('/admin/update_package/<int:package_id>', methods=['PUT'])
# @token_required(required_role='admin')
def update_package_by_id(package_id):
    return update_package_by_id_service(package_id)


# Delete package
@admins.route('/admin/delete_package/<int:package_id>', methods=['DELETE'])
# @token_required(required_role='admin')
def delete_package_by_id(package_id):
    return delete_package_by_id_service(package_id)


# Get all users
@admins.route('/admin/get_all_users', methods=['GET'])
# @token_required(required_role='admin')
def get_all_users():
    return get_all_users_service()


@admins.route('/admin/get_user_by_id/<int:user_id>', methods=['GET'])
@token_required(required_role='admin')
def get_users_by_id(user_id):
    return get_user_by_id_service(user_id)


@admins.route('/admin/get_user_by_name', methods=['GET'])
@token_required(required_role='admin')
def get_users_by_name():
    return get_users_by_name_service()


@admins.route('/admin/get_users_by_package_id/<int:package_id>', methods=['GET'])
@token_required(required_role='admin')
def get_users_by_package_id(package_id):
    return get_users_by_package_id_service(package_id)


@admins.route('/admin/get_users_by_package_name', methods=['GET'])
@token_required(required_role='admin')
def get_users_by_package_name():
    return get_users_by_package_name_service()


@admins.route('/admin/get_subscriptions_count', methods=['GET'])
@token_required(required_role='admin')
def get_subscriptions_count():
    return get_subscriptions_count_service()

@admins.route('/admin/get_revenue', methods=['GET'])
@token_required(required_role='admin')
def get_subscriptions_revenue():
    return get_subscriptions_revenue_service()
