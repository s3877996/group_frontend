from .admin import AdminApi

def initialize_routes(api):
    api.add_resource(AdminApi, '/api/admin')