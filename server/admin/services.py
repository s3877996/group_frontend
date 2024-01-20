"""
admin tasks: tracking users and subscription packages 
"""

from flask import request, make_response, jsonify
from server.database.db import db
from server.database.models import Package
from server.database.schema import PackageSchema
from server.database.models import User
from server.database.schema import UserSchema
from server.database.models import Subscription
from sqlalchemy.sql import func

package_schema = PackageSchema()
packages_schema = PackageSchema(many=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Manage subscriptions
# Get all packages
def get_all_packages_service(current_user):
    try:
        packages = Package.query.order_by(Package.id).all()
        if packages:
            return make_response(
                packages_schema.jsonify(packages),
                200
            )
        else:
            return make_response(
                {"message": "No packages found"},
                404  # Not Found
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find all packages"},
            400  # Bad Request
        )

# Get package by id
def get_package_by_id_service(id):
    try:
        package = Package.query.get(id)
        if package:
            return make_response(
                package_schema.jsonify(package),
                200
            )
        else:
            return make_response(
                {"message": "Package not found"},
                404  # Not Found
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find package by id: " + str(id)},
            400  # Bad Request
        )

# Update package 
def update_package_by_id_service(id):
    try:
        # Request must contain all the information 
        # similar as adding new package
        data = request.json

        # Get data of request
        package_name = data['package_name']
        package_period = data['package_period']
        limited_docs = data['limited_docs']
        package_price = data['package_price']
        package_description = data['package_description']
        thumbnail = data['thumbnail']

        if package_name and package_period and limited_docs and package_price and package_description:
            package = Package.query.get(id)

            if package:
                # Check whether package name or package period is existed
                package_with_existed_name = Package.query.filter_by(package_name=package_name).first()
                if package_with_existed_name and package.package_name != package_name:
                    return make_response(
                        {"message": "Package name already exists"},
                        409  # Conflict
                    )

                # Update package
                package.package_name = package_name
                package.package_period = package_period
                package.limited_docs = limited_docs
                package.package_price = package_price
                package.package_description = package_description

                if thumbnail:
                    package.thumbnail = thumbnail

                # Commit changes
                db.session.commit()

                return make_response(
                    {"message": "Package updated"},
                    200  # Created
                )

            else:
                return make_response(
                    {"message": "Package not found"},
                    404  # Not Found
                )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to update package"},
            400  # Bad Request
        )

# Delete package
def delete_package_by_id_service(id):
    # Need to check whether package is used
    try:
        package = Package.query.get(id)

        if package:
            # Delete package
            package.delete()
            return make_response(
                {"message": "Package deleted"},
                200  # Delete Success
            )
        else:
            return make_response(
                {"message": "Package not found"},
                404  # Not Found
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to delete package"},
            400  # Bad Request
        )

################################
# Manage users
# Get all users
def get_all_users_service(current_user):
    try:
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('pageSize', default=5, type=int)

        users_data = User.query.filter(User.user_role != 'admin').paginate(page=page, per_page=page_size, error_out=False)

        if users_data.items:
            users_dict = {}  # Dictionary to store unique user data based on user_id
            users_data_formatted = []

            for user in users_data.items:
                subscriptions = Subscription.query.filter_by(user_id=user.user_id).order_by(Subscription.start_time.desc()).first()

                if subscriptions:
                    package = Package.query.get(subscriptions.package_id)
                    if package:
                        user_subscription = {
                            "username": user.username,
                            "user_email": user.user_email,
                            "user_joined_date": user.user_joined_date,
                            "user_active": user.active,
                            "package_name": package.package_name,
                            "start_time": subscriptions.start_time,
                            "subscription_id": subscriptions.subscription_id
                        }

                        users_dict[user.user_id] = user_subscription

            users_data_formatted = list(users_dict.values())

            return jsonify(
                {
                    "message": "Successfully finds all users",
                    "data": users_data_formatted,
                    "totalPages": users_data.pages
                }
            )
        else:
            return make_response(
                {"message": "No users found"},
                404  # Not Found
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find all users"},
            400  # Bad Request
        )

# Get subscription counts
def get_subscriptions_count_service(current_user):
    try:
        # get all package name, 
        # then checking the number of subscriptions 
        # for each package
        packages = Package.query.order_by(Package.id).all()

        result = []
        if packages:
            for package in packages:
                subscription_count = Subscription.query \
                    .filter(Subscription.package_id == package.id) \
                    .count()
                print(subscription_count)

                result.append({
                    "package_id": package.id,
                    "package_name": package.package_name,
                    "subscription_count": subscription_count
                })

            return jsonify(result)

        else:
            return jsonify(
                {"message": "No packages found for subscription count"},
                404
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to get subscription count"},
            400
        )


# Get total revenue
def get_subscriptions_revenue_service(current_user):
    try:
        # get all package name, 
        # then checking the number of subscriptions 
        # for each package
        packages = Package.query.order_by(Package.id).all()

        result = []
        total_revenue = 0
        if packages:
            for package in packages:
                subscription_count = Subscription.query \
                    .filter(Subscription.package_id == package.id) \
                    .count()
                # print(subscription_count)

                revenue = subscription_count * package.package_price

                result.append({
                    "package_id": package.id,
                    "package_name": package.package_name,
                    "subscription_revenue": revenue
                })

                total_revenue += revenue

            return jsonify(
                {
                    "data": result,
                    "total": total_revenue
                }
            )

        else:
            return jsonify(
                {"message": "No packages found for subscription count"},
                404
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to get subscription count"},
            400
        )
