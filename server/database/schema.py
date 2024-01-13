from .db import ma


class PackageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'package_name', 'package_period', 'limited_docs', 'package_price', 'package_description')


class UserSchema(ma.Schema):
    class Meta:
        fields = (
            'user_id', 'username', 'user_fullname', 'user_birth_date', 'user_joined_date', 'user_password',
            'user_email',
            'user_role', 'phone', 'stripe_id', 'active', 'documents')

class DocumentSchema(ma.Schema):
    class Meta:
        fields = ('document_id', 'document_name', 'original_content', 'corrected_content', 'start_time', 'adjusted_time', 'file_path')
