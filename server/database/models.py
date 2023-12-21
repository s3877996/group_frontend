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
from .db import db
from datetime import datetime

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

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    user_password = db.Column(db.String(255), nullable=False)
    user_email = db.Column(db.String(255), unique=True, nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    documents = db.relationship('Document', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

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
