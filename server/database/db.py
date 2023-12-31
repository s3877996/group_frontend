# Setting PostgreSQL database
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

# user = "postgres",
# password = "your_password_here",
# host = "eeet2582-group-project-db.ch84muicwcq6.us-east-1.rds.amazonaws.com",
# port = "5432",
# dbname = "postgres"



# DATABASE_URL=postgresql://postgres:postgres@eeet2582-group-project-db.ch84muicwcq6.us-east-1.rds.amazonaws.com:5432/postgres