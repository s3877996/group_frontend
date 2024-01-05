from flask import Blueprint
from .services import (add_subscription_service, get_all_packages_service, get_package_by_id_service, get_package_by_name_service, update_package_by_id_service, delete_package_by_id_service, get_all_users_service)

admins = Blueprint('admin', __name__)

@admins.route('/admin')
def admin():
    # return admin page
    return 'Admin page'

# Manage subscriptions
# Add package
@admins.route('/admin/add_package', methods=['POST'])
def add_subscription():
    return add_subscription_service()

# Get all packages
@admins.route('/admin/get_all_packages', methods=['GET'])
def get_all_packages():
    return get_all_packages_service()

# Get package by id
@admins.route('/admin/get_package/<int:package_id>', methods=['GET'])
def get_package_by_id(package_id):
    return get_package_by_id_service(package_id)

# Get package by name
@admins.route('/admin/get_package', methods=['GET'])
def get_package_by_name():
    return get_package_by_name_service()

# Update package by id
@admins.route('/admin/update_package/<int:package_id>', methods=['PUT'])
def update_package_by_id(package_id):
    return update_package_by_id_service(package_id)

# Delete package
@admins.route('/admin/delete_package/<int:package_id>', methods=['DELETE'])
def delete_package_by_id(package_id):
    return delete_package_by_id_service(package_id)

# Get all users
@admins.route('/admin/get_all_users', methods=['GET'])
def get_all_users():
    return get_all_users_service()