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

from flask import jsonify
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
    thumbnail = db.Column(db.String(255), nullable=True)
    limited_docs = db.Column(db.String(255), nullable=False)
    package_price = db.Column(db.Numeric(10, 2), nullable=False)
    stripe_price = db.Column(db.String(255))
    package_description = db.Column(db.Text)
    users = db.relationship('User', backref='package', lazy=True)
    subscriptions = db.relationship('Subscription', back_populates='package', lazy=True)

    def __repr__(self):
        return f'<Package {self.package_name}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    @classmethod
    def get_all(cls):
        return cls.query.filter(cls.package_price >0).order_by(cls.package_price).all()
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter(cls.id == id).first()

# User
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    fullname = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)

    user_password = db.Column(db.String(255), nullable=False)
    user_email = db.Column(db.String(255), unique=True, nullable=False)
    stripe_id = db.Column(db.String(255), nullable=True)
    # package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=True, default=1)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    documents = db.relationship('Document', backref='user', lazy=True)
    subscriptions = db.relationship('Subscription', back_populates='user', lazy=True)

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
    def update_stripe(cls,id,stripe_id):
        cls.query.filter(cls.user_id==id).update({'stripe_id':stripe_id})
        db.session.commit()
    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.join(Package).filter(cls.user_id == user_id).first()

    @classmethod
    def get_by_email(cls, user_email):
        return cls.query.filter_by(user_email=user_email).first()

    @classmethod
    def update(cls,id, username=None, user_password=None, stripe_id=None,fullname=None,phone=None):
        user = cls.query.filter(cls.user_id==id).first()
        if username:
            user.username = username
        if stripe_id:
            user.stripe_id = stripe_id
        if fullname:
            user.fullname = fullname
        if phone:
            user.phone = phone
        if user_password:
            # print(f"Before Update - Hashed Password: {self.user_password}")
            user.password = generate_password_hash(user_password)
            # print(f"After Update - Hashed Password: {self.user_password}")
        db.session.merge(user)
        db.session.flush()
        db.session.commit()

        return {"id":user.user_id}

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

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    subscription_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    amount = db.Column(db.Integer)
    available_doc = db.Column(db.Integer)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=True, default=1)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    next_time = db.Column(db.DateTime, nullable=False)
    adjusted_time = db.Column(db.DateTime)
    session_id = db.Column(db.String(255))
    status = db.Column(db.String(255))
    user = db.relationship('User', back_populates='subscriptions')
    package = db.relationship('Package', back_populates='subscriptions')

    def __repr__(self):
        return f'<Sub {self.document_name}>'

    @classmethod
    def create(cls, package_id, user_id, amount, next_time, session_id=None, status='SUCCESS', available_doc=0):
        new_sub = cls(
            package_id=package_id,
            user_id=user_id,
            next_time=next_time,
            amount=amount,
            available_doc=available_doc,
            session_id=session_id,
            status=status
        )
        db.session.add(new_sub)
        db.session.commit()
        return new_sub

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def get_by_session_id(cls, session_id):
        return cls.query.filter(cls.session_id == session_id).first()

    @classmethod
    def update_by_session_id(cls, session_id, status):
        cls.query.filter(cls.session_id == session_id).update({'status': status})
        db.session.commit()

    @classmethod
    def get_by_user_id(cls, user_id):
        return cls.query.join(User).join(Package).filter(cls.user_id == user_id, cls.status != 'Pending').order_by(
            cls.start_time.desc()).first()

    @classmethod
    def get_all(cls, user_id):
        return cls.query.join(User).filter(cls.user_id == user_id, cls.status != 'Pending').order_by(
            cls.start_time.desc()).all()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


