from flask import Flask
from flask_restful import Api
from server.resources.routes import initialize_routes

app = Flask(__name__)
api = Api(app)

# Initialize database

# Initialize API routes
initialize_routes(api)

# Start server
app.run()