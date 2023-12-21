from flask import Blueprint
from .services import (add_subscription_service)

admins = Blueprint('admin', __name__)

@admins.route('/admin')
def admin():
    # return admin page
    return 'Admin page'

# Manage subscriptions
# Add package
@admins.route('/admin/add_subscription', methods=['POST'])
def add_subscription():
    return add_subscription_service()

