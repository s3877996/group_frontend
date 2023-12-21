from flask import Flask
from flask_restful import Api
from server.resources.routes import initialize_routes
from server.database.db import init_db

app = Flask(__name__)
api = Api(app)

# Initialize database
init_db(app)

# Initialize API routes
initialize_routes(api)

# Start server
app.run()