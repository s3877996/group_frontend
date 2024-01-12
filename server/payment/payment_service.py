from datetime import datetime, timedelta
from flask import request, jsonify

from server.database.models import Package, Subscription, User
from server.payment.stripe_service import StripeService

stripe = StripeService()


def success_payment(current_user):
    pass


def create_payment_link(current_user):
    payment_data = request.json

    if not payment_data:
        return jsonify({"message": "Please provide user details", "error": "Bad request"}), 400
    cus_stripe_id = current_user.stripe_id
    if not cus_stripe_id:
        cus_stripe_id = stripe.create_cus(
            email=current_user.user_email,
            fullname=current_user.username
        )
        User.update_stripe(id=current_user.user_id, stripe_id=cus_stripe_id)
    package = Package.get_by_id(payment_data['package_id'])
    checkout_session = stripe.create_stripe_link(price_id=package.stripe_price, model='subscription',
                                                 cus_id=cus_stripe_id)
    if package.package_period == '1 month':
        next_time = datetime.now() + timedelta(days=30)
    else:
        next_time = datetime.now() + timedelta(days=365)
    Subscription.create(package_id=payment_data['package_id'], user_id=current_user.user_id,
                        amount=package.package_price, next_time=next_time, session_id=checkout_session.id,
                        status='Pending', available_doc=package.limited_docs)
    return {"link": checkout_session.url}


def webhook():
    payload = request.data.decode("utf-8")
    received_sig = request.headers.get("Stripe-Signature", None)

    try:
        event = stripe.get_event_webhook(payload, received_sig)
    except Exception as e:
        print(e)
    if event.type == 'checkout.session.completed':
        session_id = event['data']['object']['id']
        Subscription.update_by_session_id(session_id, 'SUCCESS')

    print(
        "Received event: id={id}, type={type}".format(
            id=event.id, type=event.type
        )
    )