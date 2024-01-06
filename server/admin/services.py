"""
admin tasks: tracking users and subscription packages 
"""

from flask import request, make_response, jsonify
from server.database.db import db
from server.database.models import Package
from server.database.schema import PackageSchema
from server.database.models import User
from server.database.schema import UserSchema
from server.database.models import UserPackage
from sqlalchemy.sql import func

package_schema = PackageSchema()
packages_schema = PackageSchema(many=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Manage subscriptions
# Add package
def add_subscription_service():
    data = request.json

    # Get data of new subscription
    package_name = data['package_name']
    package_period = data['package_period']
    limited_docs = data['limited_docs']
    package_price = data['package_price']
    package_description = data['package_description']

    if package_name and package_period and limited_docs and package_price and package_description:
        
        # Check whether package is existed
        package_with_existed_name = Package.query.filter_by(package_name=package_name).first()
        if package_with_existed_name:
            return make_response(
                {"message": "Package name already exists"},
                409 # Conflict
            )
        
        package_with_existed_period = Package.query.filter_by(package_period=package_period).first()
        if package_with_existed_period:
            return make_response(
                {"message": "Package period already exists"},
                409 # Conflict
            )
        
        try:
            # Create new package
            new_package = Package(package_name=package_name, package_period=package_period, limited_docs=limited_docs, package_price=package_price, package_description=package_description)
            new_package.save() # Save package

            return make_response (
                {"message": "Subscription added"},
                200 # Created
            )
        
        except Exception as e:
            print(e)
            db.session.rollback()
            return make_response (                
                {"message": "Unable to add new package"},
                400 # Bad Request
            )
    return make_response (
        {"message": "Invalid request"},
        400 # Bad Request
    )

# Get all packages
def get_all_packages_service():
    try:
        packages = Package.query.all()
        if packages:
            return make_response(
                packages_schema.jsonify(packages),
                200
            )
        else:
            return make_response(
                {"message": "No packages found"},
                404 # Not Found
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find all packages"},
            400 # Bad Request
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
                404 # Not Found
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find package by id: " + id},
            400 # Bad Request
        )
    
# Get package by name
def get_package_by_name_service():
    try:
        data = request.args.get('name')

        if data:
            packages = Package.query\
                .join(data)\
                .filter(func.lower(Package.package_name)\
                .like('%' + data.lower() + '%'))\
                .all()
            if packages:
                return make_response(
                    packages_schema.jsonify(packages),
                    200
                )
            else:
                return make_response(
                    {"message": "Package not found"},
                    404 # Not Found
                )
        else:
            return make_response(
                {"message": "Invalid request"},
                400 # Bad Request
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find package by name: " + name},
            400 # Bad Request
        )

# Update package --------------------------------
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

        if package_name and package_period and limited_docs and package_price and package_description:
            package = Package.query.get(id)

            if package:
                # Check whether package name or package period is existed
                package_with_existed_name = Package.query.filter_by(package_name=package_name).first()
                if package_with_existed_name and package.package_name != package_name:
                    return make_response(
                        {"message": "Package name already exists"},
                        409 # Conflict
                    )
                
                package_with_existed_period = Package.query.filter_by(package_period=package_period).first()
                if package_with_existed_period and package.package_period != package_period:
                    return make_response(
                        {"message": "Package period already exists"},
                        409 # Conflict
                    )
                
                # Update package
                package.package_name = package_name
                package.package_period = package_period
                package.limited_docs = limited_docs
                package.package_price = package_price
                package.package_description = package_description

                # Commit changes
                db.session.commit()

                return make_response(
                    {"message": "Package updated"},
                    200 # Created
                )

            else:
                return make_response(
                    {"message": "Package not found"},
                    404 # Not Found
                )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to update package"},
            400 # Bad Request
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
                200 # Delete Success
            )
        else:
            return make_response(
                {"message": "Package not found"},
                404 # Not Found
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to delete package"},
            400 # Bad Request
        )

################################
# Manage users
# Get all users
def get_all_users_service():
    try:
        users = User.query.all()
        if users:
            return make_response(
                users_schema.jsonify(users),
                200
            )
        else:
            return make_response(
                {"message": "No users found"},
                404 # Not Found
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find all users"},
            400 # Bad Request
        )

# Get user by id
def get_user_by_id_service(id):
    try:
        user = User.query.get(user_id=id)

        if user:
            return make_response(
                user_schema.jsonify(user), 
                200
            )
        else:
            return make_response(
                {"message": "User not found"},
                404 # Not Found
            )

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find user by id"},
            400
        )
    
# Get user by name
def get_users_by_name_service(name):
    try:
        data = request.args.get('name')

        if data:
            users = User.query.join(data).filter(func.lower(User.username).like('%' + data.lower() + '%')).all()
            if users:
                return make_response(
                    users_schema.jsonify(users),
                    200
                )
            else:
                return make_response(
                    {"message": "Username not found"},
                    404 # Not Found
                )
        else:
            return make_response(
                {"message": "Invalid request"},
                400 # Bad Request
            )
        
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find user by name: " + name},
            400 # Bad Request
        )

# Get users by package id
def get_users_by_package_id_service(package_id):
    try:
        users = User.query \
            .join(UserPackage, User.id == UserPackage.user_id) \
            .join(Package, Package.id == UserPackage.package_id) \
            .filter(UserPackage.package_id == package_id) \
            .all()
        
        if users:
            users_data = []

            for user in users:
                user_dict = {
                    "username": user.username,
                    "user_email": user.user_email,
                    "user_joined_date": user.user_joined_date,
                    "active": user.active, 
                    "package_name": user.package.package_name,
                    "package_start_time": user.user_package.start_time
                }
                users_data.append(user_dict)

            return jsonify(
                    {
                        "message": "Successfully find users by package id: " + package_id,
                        "data": users_data
                    },
                    200
                )
        else:
            return jsonify(
                {
                    "message": "No users found"
                },
                404
            )
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find users by package id: " + package_id},
            400
            
        )
    
# Get users by package name
def get_users_by_package_name_service():
    try:
        package_name = request.args.get('name')

        users = User.query \
            .join(UserPackage, User.id == UserPackage.user_id) \
            .join(Package, Package.id == UserPackage.package_id) \
            .filter(Package.package_name.like(f'%{package_name}%')) \
            .all()
        
        if users:
            users_data = []

            for user in users:
                user_dict = {
                    "username": user.username,
                    "user_email": user.user_email,
                    "user_joined_date": user.user_joined_date,
                    "active": user.active, 
                    "package_name": user.package.package_name,
                    "package_start_time": user.user_package.start_time
                }
                users_data.append(user_dict)

            return jsonify(
                    {
                        "message": "Successfully find users by package name: " + package_name,
                        "data": users_data
                    },
                    200
                )
        else:
            return jsonify(
                {
                    "message": "No users found"
                },
                404
            )
    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response(
            {"message": "Unable to find users by package id: " + package_id},
            400
            
        )