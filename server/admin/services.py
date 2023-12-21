"""
admin tasks: tracking users and subscription packages 
"""

from server.database.db import db
from flask import Flask, request, make_response
from server.database.models import Package

# Manage subscriptions
# Add package
def add_subscription_service():
    data = request.json
    # print(data) # Test received data

    # Get data of new subscription
    package_name = data['package_name']
    package_period = data['package_period']
    limited_docs = data['limited_docs']
    package_price = data['package_price']
    package_description = data['package_description']

    # Check if whether subscription is existing
    if package_name and package_period and limited_docs and package_price and package_description:
        existing_package = Package.query.filter_by(package_name=package_name).first()
        if existing_package:
            return make_response(
                {"message": "Subscription already exists"},
                409 # Conflict
            )

        # Create new package
        new_package = Package(package_name=package_name, package_period=package_period, limited_docs=limited_docs, package_price=package_price, package_description=package_description)
        new_package.save() # Save package

        return make_response (
            {"message": "Subscription added"},
            200 # Created
        )
    return make_response (
        {"message": "Unable to add new package"},
        400 # Bad Request
    )

# Get all packages

# Update package

# Delete package




    

