from flask import Blueprint, request

from server.auth.auth_middleware import token_required
from server.payment.payment_service import create_payment_link, webhook

payment = Blueprint('payments', __name__)


@payment.route("payments/create-payment-link", methods=["POST"])
@token_required
def create_link(current_user):
    print(current_user)
    return create_payment_link(current_user)


@payment.route("payments/webhook", methods=['POST'])
def stripe_webhook():
    webhook()
    return "", 200


# @payment.route("/", methods=['GET'])
# def test():
#     return 'Success', 200

def handle_checkout_session(session):
    print("Payment was successful.")


