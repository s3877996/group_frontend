import os 
from dotenv import load_dotenv
import logging

load_dotenv()
# SECRET_KEY =os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = False
# config.py
JWT_SECRET_KEY = 'your_secret_key_here'