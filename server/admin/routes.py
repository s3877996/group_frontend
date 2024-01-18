from flask import Blueprint
from ..auth.auth_middleware import token_required
from .services import (\
        add_package_service, \
        get_all_packages_service, \
        get_package_by_id_service, \
        update_package_by_id_service, \
        delete_package_by_id_service, \
        get_all_users_service, 
        get_subscriptions_count_service, \
        get_subscriptions_revenue_service, \
    )
from ..auth.auth_middleware import token_required

admins = Blueprint('admin', __name__)

# Manage subscriptions
# Add package
# @admins.route('/admin/add_package', methods=['POST'])
# @token_required(required_role='admin')
# def add_package():
#     return add_package_service()

# Get all packages
@admins.route('/admin/get_all_packages', methods=['GET'])
@token_required(required_role='admin')
def get_all_packages(current_user):
    return get_all_packages_service(current_user)

# Get package by id
@admins.route('/admin/get_package/<int:package_id>', methods=['GET'])
@token_required(required_role='admin')
def get_package_by_id(current_user, package_id):
    return get_package_by_id_service(package_id)

# Update package by id
@admins.route('/admin/update_package/<int:package_id>', methods=['PUT'])
@token_required(required_role='admin')
def update_package_by_id(current_user, package_id):
    return update_package_by_id_service(package_id)

# Delete package
@admins.route('/admin/delete_package/<int:package_id>', methods=['DELETE'])
@token_required(required_role='admin')
def delete_package_by_id(current_user, package_id):
    return delete_package_by_id_service(package_id)

# Get all users
@admins.route('/admin/get_all_users', methods=['GET'])
@token_required(required_role='admin')
def get_all_users(current_user):
    return get_all_users_service(current_user)

# @admins.route('/admin/get_users_by_package_id/<int:package_id>', methods=['GET'])
# @token_required(required_role='admin')
# def get_users_by_package_id(package_id):
#     return get_users_by_package_id_service(package_id)

# @admins.route('/admin/get_users_by_package_name', methods=['GET'])
# @token_required(required_role='admin')
# def get_users_by_package_name():
#     return get_users_by_package_name_service()

@admins.route('/admin/get_subscriptions_count', methods=['GET'])
@token_required(required_role='admin')
def get_subscriptions_count(current_user):
    return get_subscriptions_count_service(current_user)

@admins.route('/admin/get_revenue', methods=['GET'])
@token_required(required_role='admin')
def get_subscriptions_revenue(current_user):
    return get_subscriptions_revenue_service(current_user)
