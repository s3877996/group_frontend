import os 
from dotenv import load_dotenv
print("FLASK_DEBUG:", os.environ.get("FLASK_DEBUG"))
load_dotenv()

SECRET_KEY =os.environ.get('SECRET_KEY') or 'this is a secret'
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'this is a JWT secret'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = False
STRIPE_KEY: str = os.environ.get('STRIPE_KEY')
WEBHOOK_STRIPE_KEY: str = os.getenv("WEBHOOK_STRIPE_KEY") or'whsec_16aa8c69c742806e98fba8414cab4eb1f449291d5bf6f8b37278bb7eb501b996'
FE_DOMAIN= os.getenv("FE_DOMAIN") or 'http://localhost:3000/'