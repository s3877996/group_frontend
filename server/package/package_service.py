from server.database.models import Package

    # package_name = db.Column(db.String(255), nullable=False)
    # package_period = db.Column(db.String(255), nullable=False)
    # limited_docs = db.Column(db.String(255), nullable=False)
    # package_price = db.Column(db.Numeric(10, 2), nullable=False)
    # stripe_price = db.Column(db.String(255))
    # package_description = db.Column(db.Text)

def package_all():
    packages = Package.get_all()
    package = [{
                "id":sub.id,
                "thumbnail":sub.thumbnail,
                "package_name": sub.package_name,
                "package_period":sub.package_period,
                "limited_docs":sub.limited_docs,
                "package_price":sub.package_price,
                "package_description": sub.package_description,
                       # Include other fields as needed
            } for sub in packages ]
    return package