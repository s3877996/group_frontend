"""
admin tasks: tracking users and subscription packages 
"""

from flask import request, make_response
from server.database.db import db
from server.database.models import Package
from server.database.schema import PackageSchema
from sqlalchemy.sql import func

package_schema = PackageSchema()
packages_schema = PackageSchema(many=True)

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
            packages = Package.query.join(data).filter(func.lower(Package.package_name).like('%' + data.lower() + '%')).all()
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
            {"message": "Unable to find package by id: " + id},
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




    

