import os 
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY =os.environ.get('SECRET_KEY') or 'this is a secret'
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'this is a JWT secret'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = False