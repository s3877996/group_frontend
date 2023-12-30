"""
    User:
        - id
        - name
        - email
        - password
        - acc plan type (0, 1, 2, 3, etc. - default: 0 for trial)
"""

"""
    Document - User:
        - id
        - user_id
        - title
        - content of original document
        - content of processed document
        - created_at
        - updated_at (after modified timestamp)
"""

"""
    Subscription packages:
        - id
        - name
        - price
        - period
        - number of available documents (optional)
"""

import os
from .db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE_URL = os.environ.get('DATABASE_URL')


# Subcription package
class Package(db.Model):
    __tablename__ = 'packages'
    id = db.Column(db.Integer, primary_key=True)
    package_name = db.Column(db.String(255), nullable=False)
    package_period = db.Column(db.String(255), nullable=False)
    limited_docs = db.Column(db.String(255), nullable=False)
    package_price = db.Column(db.Numeric(10, 2), nullable=False)
    package_description = db.Column(db.Text)
    users = db.relationship('User', backref='package', lazy=True)

    def __repr__(self):
        return f'<Package {self.package_name}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()



# User
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    user_password = db.Column(db.String(255), nullable=False)
    user_email = db.Column(db.String(255), unique=True, nullable=False)
    # package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=True, default=1)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    documents = db.relationship('Document', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    # delete the account
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def create(cls, username, user_email, user_password, package_id=1):
        user = cls.query.filter_by(user_email=user_email).first()
        if user:
            return False  # Indicate that the user already exists

        hashed_password = generate_password_hash(user_password)
        new_user = cls(
            username=username,
            user_email=user_email,
            user_password=hashed_password,
            package_id=package_id  # Set package_id explicitly
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.get(user_id)

    @classmethod
    def get_by_email(cls, user_email):
        return cls.query.filter_by(user_email=user_email).first()

    def update(self, username=None, user_password=None):
        if username:
            self.username = username
        if user_password:
            print(f"Before Update - Hashed Password: {self.user_password}")
            self.set_password(user_password)
            print(f"After Update - Hashed Password: {self.user_password}")
        db.session.commit()
        return {
            "user_id": self.user_id,
            "username": self.username,
            "user_email": self.user_email,
            "package_id": self.package_id,
            "start_time": self.start_time.isoformat(),
        }

    def set_password(self, password):
        self.user_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.user_password, password)

    # may need active account
    def disable_account(self):
        # Assuming you have an 'active' column in your table
        self.active = False
        db.session.commit()

    def login(cls, user_email, password):
        user = cls.query.filter_by(user_email=user_email).first()
        if not user or not check_password_hash(user.user_password, password):
            return None  # Invalid credentials

        return user


# Uploaded Document
class Document(db.Model):
    __tablename__ = 'documents'
    document_id = db.Column(db.Integer, primary_key=True)
    document_name = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    original_content = db.Column(db.Text)
    corrected_content = db.Column(db.Text)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    adjusted_time = db.Column(db.DateTime)

    def __repr__(self):
        return f'<Document {self.document_name}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
