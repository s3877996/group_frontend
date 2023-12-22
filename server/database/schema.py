from .db import ma

class PackageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'package_name', 'package_period', 'limited_docs', 'package_price', 'package_description')

