from .db import ma

class PackageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'package_name', 'package_period', 'limited_docs', 'package_price', 'package_description')

class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id', 'username', 'user_password', 'user_email', 'package_id', 'start_time', 'documents')