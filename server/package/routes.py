from flask import Blueprint, request

from server.auth.auth_middleware import token_required
from server.package.package_service import package_all


package = Blueprint('packages', __name__)





@package.route("/packages", methods=['GET'])
def test():
    return package_all()




