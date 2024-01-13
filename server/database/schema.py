from .db import ma


class PackageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'package_name', 'package_period', 'thumbnail', 'limited_docs', 'package_price', 'stripe_price', 'package_description')


class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id', 'username', 'user_fullname', 'user_birth_date', 'user_joined_date', 'user_password', 'user_email', 'user_role', 'phone', 'stripe_id', 'active')
