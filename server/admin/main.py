import os
from flask import Flask, request, jsonify
from firebase_admin import credentials, initialize_app, auth, db
from server.database.db import db
import stripe
from datetime import datetime
from sqlalchemy.sql import func


app = Flask(__name__)


# Load environment variables
os.environ["STRIPE_PRIVATE_KEY"] = "sk_test_51OP4auC8xglLK7o8T89SeGrELxFEUGxKRF4OXY9shtsmpAZdkgUIhg9jmkgNZUJ3oFTZF9h1izEtP3uem01r36nu00qtXoL3Fh"
os.environ["FIREBASE_DATABASE_URL"] = "your_firebase_database_url"

# Initialize Firebase app
cred = credentials.Certificate("path/to/serviceAccountKey.json")
initialize_app(cred, {"databaseURL": os.environ.get("FIREBASE_DATABASE_URL")})

# Initialize Stripe
stripe.api_key = os.environ.get("STRIPE_PRIVATE_KEY")

# Define price IDs
basic = "price_1OP4fnC8xglLK7o872PWYFNG"
standard = "price_1OP4ocC8xglLK7o84pv8sHb8"
premium = "price_1OP4pAC8xglLK7o8OXksEtCA"

@app.route("/api/v1/create-subscription-checkout-session", methods=["POST"])
def create_subscription_checkout_session():
    data = request.get_json()
    plan = data.get("plan")
    customer_id = data.get("customerId")

    plan_id = None
    if plan == 19:
        plan_id = basic
    elif plan == 29:
        plan_id = standard
    elif plan == 39:
        plan_id = premium

    try:
        session = stripe.checkout.Session.create(
            line_items=[{"price": plan_id, "quantity": 1}],
            mode="subscription",
            payment_method_types=["card"],
            success_url="http://localhost:5000/success",
            cancel_url="http://localhost:5000/cancel",
        )

        user = auth.get_user(customer_id)
        db.reference("users").child(user.uid).update({"subscription": {"sessionId": session.id}})

        return jsonify({"session": session}), 201  # Use 201 status code for creation
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/v1/payment-success", methods=["POST"])
def payment_success():
    data = request.get_json()
    session_id = data.get("sessionId")
    firebase_id = data.get("firebaseId")

    try:
        session = stripe.checkout.Session.retrieve(session_id)

        if session.payment_status == "paid":
            subscription_id = session.subscription
            subscription = stripe.Subscription.retrieve(subscription_id)
            user = auth.get_user(firebase_id)

            plan_id = subscription.plan.id
            plan_type = ""
            if subscription.plan.amount == 190:
                plan_type = "basic"
            elif subscription.plan.amount == 290:
                plan_type = "standard"
            elif subscription.plan.amount == 390:
                plan_type = "premium"

            start_date = datetime.fromtimestamp(subscription.current_period_start)
            end_date = datetime.fromtimestamp(subscription.current_period_end)
            duration_in_days = (end_date - start_date).days

            db.reference("users").child(user.uid).update(
                {"subscription": {
                    "sessionId": None,
                    "planId": plan_id,
                    "planType": plan_type,
                    "planStartDate": start_date.strftime("%Y-%m-%d"),
                    "planEndDate": end_date.strftime("%Y-%m-%d"),
                    "planDuration": duration_in_days
                }}
            )

            return jsonify({"message": "Payment Successful"}), 200
        else:
            return jsonify({"message": "Payment Failed"}), 402  # Use 402 status code for payment failure
    except Exception as e:
        return jsonify({"error": str(e)}), 400